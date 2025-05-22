import { Heading } from "../../../components/Heading";

export default function Home() {
  return (
    <main id="maincontent" className="p-5 mb-20 min-h-screen" role="main" tabIndex={-1}>
      <Heading level={1} id="favourites-heading" autoFocus>
        Favourites
      </Heading>  
      <section className="h-full">
       <p>WIP</p>
       <p>The favourites page is WIP</p>
      </section>
    </main>
  );
}
