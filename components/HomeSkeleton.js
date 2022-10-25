import Head from "next/head";
import Image from "next/image";
import Skeleton from "./Skeleton";
import useMedia from "../hooks/useMedia";

const CREDIT_CARDS = new Array(5).fill(null);
const CARD_SUBSCRIPTIONS = new Array(6).fill(null);

export default function HomeSkeleton() {
  // FIXME: Use the https://github.com/glrodasz/cero-web/blob/master/features/common/hooks/useBreakpoints.js hook instead
  const isDesktop = useMedia(["(min-width: 992px)"], [true]);
  const isMobile = useMedia(["(max-width: 799px)"], [true]);

  return (
    <>
      <Head>
        <title>Sublr</title>
      </Head>

      <nav>
        <div className="container">
          <section className="row">
            <figure className="logo">
              <img
                src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`}
              ></img>
            </figure>
            <div className="filters">
              <div className="filter-skeleton">
                {!isMobile && <Skeleton.Box width={72} height={36} />}

                <Skeleton.Box width={90} height={36} />
              </div>
              <div className="filter-skeleton">
                {!isMobile && <Skeleton.Box width={92} height={36} />}
                <Skeleton.Box width={80} height={36} />
              </div>

              {!isMobile && (
                <>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={42} height={36} />
                    <Skeleton.Box width={111} height={36} />
                  </div>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={57} height={36} />
                    <Skeleton.Box width={207} height={36} />
                  </div>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={45} height={36} />
                    <Skeleton.Box width={200} height={36} />
                  </div>
                </>
              )}

              {/* ))} */}
            </div>
            <div>
              <Skeleton.Circle diameter={40} />
            </div>
          </section>
        </div>
      </nav>

      <main className="container">
        <section className="row">
          <article>
            <Skeleton.Box width={120} height={16} dark />
            <Skeleton.Box width={220} height={35} />
          </article>
        </section>

        <section>
          <Skeleton.Text lineWidth={120} lineHeight={16} dark />
          <div className="cards-container">
            {CREDIT_CARDS.map((_, idx) => (
              <div key={`credit-card-${idx}`} className="credit-card-skeleton">
                <Skeleton.Box width={60} height={16} />
                <Skeleton.Box width={100} height={16} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton.Text lineWidth={120} lineHeight={16} dark />
          <div className="cards-container">
            {CARD_SUBSCRIPTIONS.map((_, idx) => (
              <div
                key={`card-subscription-${idx}`}
                className="card-subscription-skeleton"
              >
                <div className="cover">
                  <Skeleton.Box width="30%" height={14} dark />

                  <div className="tags">
                    <Skeleton.Box width="20%" height={14} dark />
                    <Skeleton.Box width="20%" height={14} dark />
                    <Skeleton.Box width="20%" height={14} dark />
                  </div>
                </div>

                <div className="content">
                  <Skeleton.Box width="45%" height={18} />
                  <Skeleton.Box width="20%" height={18} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        article,
        section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        nav {
          background: #b51739;
          padding: 12px 0;
        }

        nav > .container {
          padding: 0 20px;
        }

        .logo {
          max-width: 100px;
        }

        .logo > img {
          width: 100%;
        }

        .filters {
          display: flex;
          width: 100%;
          gap: 15px 20px;
          flex-wrap: wrap;
        }

        .filter-skeleton {
          display: flex;
          gap: 10px;
        }

        .container {
          height: 100%;
          width: 100%;
          max-width: 800px;
          padding: 20px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .row {
          flex-direction: row;
          align-items: center;
          gap: 10px 50px;
        }

        .cards-container {
          width: 100%;
          min-height: 100%;
          display: grid;
          gap: 30px;
          place-content: center;
          grid-template-columns: minmax(300px, 1fr);
        }

        .credit-card-skeleton {
          display: flex;
          justify-content: space-between;
          gap: 20;
          padding: 15px 20px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.01);
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        .card-subscription-skeleton {
          background-color: #fff;
          border-radius: 8px 8px 0 0;
          height: 310px;
        }

        .card-subscription-skeleton .cover {
          background: #d9d9d9;
          height: 180px;
          padding: 10px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .card-subscription-skeleton .cover .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 10px 0px;
          width: 100%;
        }

        .card-subscription-skeleton .content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
        }

        @media only screen and (min-width: 800px) {
          .container {
            max-width: 900px;
          }

          .cards-container {
            grid-template-columns: repeat(2, minmax(300px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .container {
            max-width: 1440px;
          }

          .cards-container {
            grid-template-columns: repeat(3, minmax(300px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
