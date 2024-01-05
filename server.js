const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Anstelle von Mongoose-Schema und Modell
const reports = [];

app.get('/', (req, res) => {
  const searchTerm = req.query.search || '';
  const filteredReports = reports.filter(report => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(report.teamMember) ||
      searchRegex.test(report.playerName) ||
      searchRegex.test(report.date) ||
      searchRegex.test(report.report)
    );
  });

  let reportListHTML = `
    <h2>Berichte</h2>
    <form action="/" method="get">
      <label for="search">Suche nach:</label>
      <input type="text" id="search" name="search" placeholder="Spielername, Teammitglied, Datum, Bericht" value="${searchTerm}">
      <button type="submit">Suchen</button>
    </form>
    <a href="/create" class="to-create-button">Neuen Bericht erstellen</a>
    <ul>
  `;

  filteredReports.forEach(report => {
    reportListHTML += `
      <li>
        <a href="/report/${report.id}">
          <strong>${report.teamMember}</strong> hat <strong>${report.playerName}</strong> am ${report.date} gebannt/gekickt: ${report.report}
        </a>
      </li>`;
  });

  reportListHTML += '</ul>';
  res.send(reportListHTML);
});

app.post('/addReport', (req, res) => {
  const { teamMember, playerName, date, report } = req.body;
  const newReport = {
    id: reports.length + 1, // Ersetze dies durch eine geeignete Methode zur Generierung von IDs
    teamMember,
    playerName,
    date,
    report,
  };
  reports.push(newReport);
  res.redirect('/');
});

app.get('/report/:id', (req, res) => {
  const id = req.params.id;
  const report = reports.find(report => report.id == id); // Achtung: Hier wird ein einfacher Vergleich durchgeführt, nicht für den Produktiveinsatz geeignet
  if (!report) {
    return res.status(404).send('Bericht nicht gefunden');
  }
  const reportHTML = `
    <h2>Berichtsakte</h2>
    <link rel="stylesheet" type="text/css" href="/report-stylesheet.css">
    <h3>${report.teamMember} hat ${report.playerName} am ${report.date} gebannt/gekickt:</h3>
    <p>${report.report}</p>`;
  res.send(reportHTML);
});

app.get('/create', (req, res) => {
  const createFormHTML = `
    <html>
      <head>
        <title>Ban/Kick Bericht erstellen</title>
        <style>
          /* CSS hier einfügen */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }

          .to-create-button {
            background-color: #3498db;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 10px;
          }

          .to-create-button:hover {
            background-color: #2980b9;
          }

          /* Neue Stile für das Berichtsformular */
          form {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          label {
            display: block;
            margin-bottom: 8px;
          }

          input,
          textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            box-sizing: border-box;
          }

          button {
            background-color: #4caf50;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <h2>Ban/Kick Bericht erstellen</h2>
        <form action="/addReport" method="post">
          <label for="teamMember">Teammitglied:</label>
          <input type="text" id="teamMember" name="teamMember" placeholder="Name des Teammitglieds" required>
          <br>
          <label for="playerName">Spielername:</label>
          <input type="text" id="playerName" name="playerName" placeholder="Spielername" required>
          <br>
          <label for="date">Datum:</label>
          <input type="date" id="date" name="date" required>
          <br>
          <label for="report">Bericht:</label>
          <textarea id="report" name="report" placeholder="Gib hier deinen Bericht ein..." required></textarea>
          <br>
          <button type="submit">Hinzufügen</button>
        </form>
      </body>
    </html>`;

  res.send(createFormHTML);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
