
# Project MongoDB API

As part of a Technigo Web Dev Bootcamp project, this API was created using Express JS, MongoDB and Mongoose. The API uses data from a Netflix API provided by Technigo, which is then broken down into endpoints selected by me.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL` - Get your Conncection String from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register). 

`RESET_DB` - if you choose to uncomment that part of the seedDatabase function. 
## API Reference

#### Get all movies

```http
  GET /movies
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get one movie

```http
  GET /movies/:id/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of movie to fetch. Replace ":id" with your id. |

#### Get movies on year

```http
  GET /movies/year/:year
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `year`      | `string` | **Required**. Year in a number of movie to fetch. Replace ":year" with the year you wish to search for. |

#### Get movies on title

```http
  GET /movies/title/:title
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required**. A string part of a the movie title you wish to fetch. Replace ":title" with the title you wish to search for. |

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-1DA1F2?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-laura-lyckholm.netlify.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lauralyckholm/)

[![gitgub](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LauraLyckholm)