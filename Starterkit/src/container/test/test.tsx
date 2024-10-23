import { FC, Fragment, useState } from "react";

interface Test {}

const Test: FC<Test> = () => {
  const [genres, setGenres] = useState("");
  const [mood, setMood] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const depthPreference =
    depth === "simple"
      ? "Предпочитам филмите да са лесни за проследяване, релаксиращи."
      : depth === "complex"
      ? "Предпочитам филмите да се задълбочават и да имат специфични истории и/или терминологии, специфично съществуващи във филма."
      : "Нямам предпочитания за дълбочината на филма.";

  const generateMovieRecommendations = async () => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"key"}`
          },
          body: JSON.stringify({
            model: "gpt-4-0125-preview", // Ensure correct model
            messages: [
              {
                role: "system",
                content: `You are an AI that recommends movies based on user preferences. Provide a list of 10 movies that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
              },
              {
                role: "user",
                content: `Препоръчай ми 10 филма за гледане, които да са съобразени с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres}. 
              Емоционално състояние в този момент: ${mood}.  
              Разполагаемо свободно време за гледане: ${timeAvailable}.  
              Любими актьори: ${actors}.  
              Любими филмови режисьори: ${directors}. 
              Теми, които ме интересуват: ${interests}. 
              Филмите могат да бъдат от следните страни: ${countries}.  
              Темпото (бързината) на филмите предпочитам да бъде: ${pacing}.  
              ${depthPreference}
              Целевата група е: Без възрастови ограничения.
              Дай информация за всеки отделен филм по отделно защо той е подходящ за мен. Форматирай своя response в JSON формат по този начин:
              {
                "MovieTitle1": {
                  "bgName": "Официално име на филма на български",
                  "description": "Описание на филма",
                  "reason": "Защо този филм е подходящ за мен?"
                },
                "MovieTitle2": {
                  "bgName": "Официално име на филма на български",
                  "description": "Описание на филма",
                  "reason": "Защо този филм е подходящ за мен?"
                },
                // ...additional movies
              }`
              }
            ]
          })
        }
      );

      const recommendations = await response.json(); // Get the JSON response
      console.log(recommendations);

      for (const movieTitle in recommendations) {
        const movieName = movieTitle; // Use the movie title as the search term
        console.log(`Fetching IMDb ID for: ${movieName}`);

        // Step 3: Fetch IMDb ID via Google Custom Search API
        const imdbResponse = await fetch(
          `https://customsearch.googleapis.com/customsearch/v1?key=YOUR_GOOGLE_API_KEY&cx=e59ceff412ebc4313&q=${encodeURIComponent(
            movieName
          )}`
        );
        const imdbData = await imdbResponse.json();

        // Step 4: Extract the IMDb link from the search results
        if (Array.isArray(imdbData.items)) {
          const imdbLink = imdbData.items.find((item: { link: string }) =>
            item.link.includes("imdb.com/title/")
          );

          if (imdbLink) {
            const imdbUrl = imdbLink.link;
            const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1]; // Extract IMDb ID from the URL
            if (imdbId) {
              console.log(`IMDb ID for ${movieName}: ${imdbId}`);

              const omdbResponse = await fetch(
                `http://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}`
              );
              const omdbData = await omdbResponse.json();

              console.log(`OMDb data for ${movieName}: ${omdbData}`);
            } else {
              console.log(`IMDb ID not found for ${movieName}`);
            }
          }
          // TO DO: Да се измисли какво да се прави ако не се намери филма/сериала
        }
      }

      // Process the API response (e.g., display the recommended movies)
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start min-h-screen pt-80 page-header-breadcrumb">
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-6 col-span-12">
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput" className="form-label">
                На кои жанрове най-много се наслаждавате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Пример: хорър, екшън, криминален"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Как се чувствате в момента?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: развълнуван/на, любопитен/на, тъжен/на, изплашен/на"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                С какво време разполагате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: 2 часа, 3 часа, цяла вечер"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Кои са вашите любими актьори?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Кои филмови режисьори предпочитате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
                value={directors}
                onChange={(e) => setDirectors(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Какви теми ви интересуват?
              </label>
              <div className="form-text">
                Предпочитате филм, който засяга определена ера, държава или пък
                такъв, в който се изследва, разгадава мистерия или социален
                проблем? Дайте описание.
              </div>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder=""
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                От кои страни предпочитате да е филмът?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: България, САЩ"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Филми с каква бързина на развитие на сюжетното действие
                предпочитате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: бавни, концентриращи се върху разкази на героите; бързи с много напрежение"
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Филми с какво ниво на задълбочаване харесвате?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: лесни за проследяване - релаксиращи, трудни - с много истории и терминологии, характерни за филма"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                Каква е вашата целева група?
              </label>
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Пример: за деца, за възрастни, семейни филми"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
              />
            </div>

            <div className="ti-btn-list space-x-2 rtl:space-x-reverse mt-4">
              <button
                type="button"
                className={`ti-btn ti-btn-primary-gradient ti-btn-wave`}
                onClick={generateMovieRecommendations}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
