# CollectedCuisines
Gotta catch them all... (the cuisines)

## Live Demo
Live demo hosted @ [collectedcuisines.com](collectedcuisines.com)

## Setup
1. Download the repository with `git clone https://github.com/hp3721/CollectedCuisines.git`
1. Start the back-end by running `cd CollectedCuisines/backend && docker run -p 8080:8080 --rm -it $(docker build -q .)`
   - Setup admin user for the dashboard via the URL in STDOUT and login
   - Import the the database schema ([backend/pb_schema.json](https://github.com/hp3721/CollectedCuisines/backend/pb_schema.json)) on the dashboard hosted at `127.0.0.1:8080/_/`
     - `Settings` -> `Sync` -> `Import Collections` -> `Load from JSON File`
   - Link oAuth 2.0 providers
     - `Collections` -> `users` -> `Edit Collection` -> `Ellipses (...)` -> `Options` -> `oAuth2`
       - Enable toggle
       - Set `client_id` and `client_secret` for Discord and Google
1. Start the front-end by running `cd CollectedCuisines/frontend && docker run -p 4000:4000 --rm -it $(docker build -q --build-arg VITE_PB_URI=127.0.0.1:8080 .)`

## License
This project is licensed under [GPL-3.0](https://github.com/hp3721/CollectedCuisines/LICENSE).
