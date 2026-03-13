<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cholkany/billing-system">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ISP Billing System</h3>

  <p align="center">
    Hotspot billing system for Mikrotik routers!
    <br />
    <a href="https://github.com/cholkany/billing-system"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/cholkany/billing-system">View Demo</a>
    &middot;
    <a href="https://github.com/cholkany/billing-system/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/cholkany/billing-system/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

**Digital ISP Billing System** is a hotspot billing and subscriber management platform built for MikroTik‑based ISPs and WISPs.  
It centralizes user management, access plans, router integration, and billing into a single web application so you can focus on running your network instead of maintaining spreadsheets and manual processes.

**Core capabilities include:**
- **Router integration**: Connect MikroTik routers via the RouterOS API for hotspot / PPP authorization and accounting.
- **Subscriber management**: Create and manage customers, credentials, and service plans.
- **Billing & usage tracking**: Track usage against plans using PostgreSQL + Drizzle ORM.
- **Modern web UI**: Next.js frontend with Tailwind‑based styling for dashboards and management views.
- **Dockerized stack**: One `docker compose up` spins up the full environment (frontend, backend, database).

> This README is based on the Best‑README‑Template but tailored specifically for this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

**Backend**
- Node.js 20 (Alpine)
- TypeScript
- [Hono](https://hono.dev/) HTTP framework
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [routeros-client](https://www.npmjs.com/package/routeros-client) for MikroTik integration

**Frontend**
- [Next.js][Next-url] (App Router)
- [React][React-url]
- Tailwind CSS v4
- shadcn/ui components

**Infrastructure**
- Docker
- Docker Compose

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

These instructions will get the project running locally using Docker. You can also run the frontend and backend separately with Node.js if you prefer.

### Prerequisites

- **Docker Desktop** (with Docker Compose)
- Recommended: **Git** and **Node.js 20+** (for local, non‑Docker development)

Confirm Docker is working:

```sh
docker version
```

### Running with Docker (recommended)

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/digital-billing-system.git
   cd digital-billing-system
   ```

2. **Configure environment variables (optional)**

   The backend and database are preconfigured with sensible defaults.  
   To customize (e.g. database URL, admin credentials), create a `.env` file in the `backend` folder and set:
   ```sh
   DATABASE_URL=postgresql://admin:admin@postgres:5432/mikrotik_billing
   # add any other secrets you need
   ```

3. **Start the full stack**
   ```sh
   docker compose up --build -d
   ```

4. **Access the apps**
   - Frontend (Next.js UI): `http://localhost:3000`
   - Backend API (Hono): `http://localhost:8787`
   - PostgreSQL: exposed only within Docker network by default

To stop everything:
```sh
docker compose down
```

### Local development (without Docker)

From the `backend` folder:
```sh
npm install
npm run dev
```

From the `frontend` folder:
```sh
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Once the stack is running:

- **Log in / onboard** using the web UI at `http://localhost:3000`.
- **Configure routers** by adding your MikroTik devices (IP, credentials) so the backend can talk to them via RouterOS.
- **Create plans** (speed, time, or data‑based) and assign them to subscribers.
- **Monitor sessions** to see who is online, for how long, and on which router.
- **Export or inspect data** directly from PostgreSQL for billing runs or analytics.

Specific UI flows (screenshots, default credentials, etc.) will depend on how you deploy and seed the database. You can adapt this section with more detailed steps as your implementation evolves.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Containerized frontend and backend
- [x] PostgreSQL + Drizzle ORM integration
- [x] Basic MikroTik RouterOS connectivity
- [ ] Advanced billing rules (quotas, overage, discounts)
- [ ] Multi‑tenant / multi‑site support
- [ ] Reporting and analytics dashboards
- [ ] Remote Router Connection
- [ ] Multi‑language UI support


Feel free to open issues or pull requests to suggest and discuss new features.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/cholkany/billing-system/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cholkany/billing-system" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project maintainer: **Digital**  
Email: ``

Project Link: [https://github.com/cholkany/billing-system](https://github.com/your-username/digital-billing-system)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

- [Best‑README‑Template](https://github.com/othneildrew/Best-README-Template) for the original structure
- [MikroTik](https://mikrotik.com/) and the RouterOS ecosystem
- [Drizzle ORM](https://orm.drizzle.team/) for a great TypeScript‑first ORM
- [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/cholkany/billing-system/
[contributors-url]: https://github.com/cholkany/billing-system/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cholkany/billing-system/
[forks-url]: https://github.com/cholkany/billing-system/network/members
[stars-shield]: https://img.shields.io/github/stars/cholkany/billing-system/?style=for-the-badge
[stars-url]: https://github.com/cholkany/billing-system/stargazers
[issues-shield]: https://img.shields.io/github/issues/cholkany/billing-system?style=for-the-badge
[issues-url]: https://github.com/cholkany/billing-system/issues
[license-shield]: https://img.shields.io/github/cholkany/billing-system?style=for-the-badge
[license-url]: https://github.com/cholkany/billing-system/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/cholkany
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 