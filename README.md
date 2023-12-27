# CWE-94-examples

This repository contains examples of code that violates CWE-94: Improper Control of Generation of Code ('Code Injection')

## Running the examples

```npm install```

```node app.js```

If you want to use nodemon:

```npm install -g nodemon```

```nodemon app.js```

Landing page:

```http://localhost:3000/```

## Examples

### Example 1

Page: /login

username:  `nesto' OR 1=1; --`
password: any

### Example 2

Page: /news

Search: `%'; --`

### Example 3

Page: /news
Add News data: `',''); DROP TABLE news --`

### Example 4

Page: /news
Add News data: `tajna tabela: ' || (SELECT tbl_name FROM sqlite_master  WHERE type='table' and tbl_name NOT like 'sqlite_%'),'user') --`

### Example 5

Page: /news
Clicking on link: `http://localhost:3000/news?search=%3Cimg%20src=x%20onerror=%22alert(5)%22/%3E`

### Example 6
Page: /news
Create new news with title: ` <img src=x onerror="alert(6)"/>`

### Example 7

Page: /news_alert
Clicking on link: `http://localhost:3000/news_alert?search=0%22);%20alert(7%2B%20%22`

### Example 8

Page: /list
Enter as folder to list: `/usr; cat /etc/passwd`

### Example 9 - html injection

Page: /news
Insert news with title: <a href="https://www.example.com" style="color: inherit; text-decoration: none;">Naslov</a>

### Example 10 - Log4j

1. instalirati go
2. skinuti biblioteku za server koji simulira ldap server:`go install github.com/alexbakker/log4shell-tools/cmd/log4shell-tools-server`
3. Na web stranici koju pokrene server pokrenuti test
4. Pokrenuti java projekat logrinjection sa argumentom koji je prikazan na serveru
