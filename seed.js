const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    title: "Comedy",
    movies: [
      { title: "Airplane", numberInStock: 5, dailyRentalRate: 2 },
      { title: "The Hangover", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Wedding Crashers", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    title: "Action",
    movies: [
      { title: "Die Hard", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Terminator", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Avengers", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    title: "Romance",
    movies: [
      { title: "The Notebook", numberInStock: 5, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Pretty Woman", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    title: "Thriller",
    movies: [
      { title: "The Sixth Sense", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Gone Girl", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Others", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Movie.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ title: genre.title }).save();
    const movies = genre.movies.map((movie) => ({
      ...movie,
      genre: { _id: genreId, title: genre.title },
    }));
    await Movie.insertMany(movies);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
