import Head from "next/head";
import Skeleton from "./Skeleton";
import useBreakpoints from "../hooks/useBreakpoints";

const CREDIT_CARDS = new Array(5).fill(null);
const CARD_SUBSCRIPTIONS = new Array(6).fill(null);

export default function HomeSkeleton() {
  const { isMobile, isDesktop } = useBreakpoints();

  return (
    <>
      <Head>
        <title>Sublr</title>
      </Head>

      <nav>
        <div className="nav-inner">
          <section className="row">
            <figure className="logo">
              <img alt="" src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`} />
            </figure>
            <div className="filters">
              <div className="filter-skeleton">
                {!isMobile && <Skeleton.Box width={72} height={36} dark />}
                <Skeleton.Box width={90} height={36} dark />
              </div>
              <div className="filter-skeleton">
                {!isMobile && <Skeleton.Box width={92} height={36} dark />}
                <Skeleton.Box width={80} height={36} dark />
              </div>

              {!isMobile && (
                <>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={42} height={36} dark />
                    <Skeleton.Box width={111} height={36} dark />
                  </div>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={57} height={36} dark />
                    <Skeleton.Box width={207} height={36} dark />
                  </div>
                  <div className="filter-skeleton">
                    <Skeleton.Box width={45} height={36} dark />
                    <Skeleton.Box width={200} height={36} dark />
                  </div>
                </>
              )}
            </div>
            <div>
              <Skeleton.Circle diameter={40} dark />
            </div>
          </section>
        </div>
      </nav>

      <main className="container">
        <section className="row hero-skel">
          <Skeleton.Box width="100%" height={120} dark />
        </section>

        <section>
          <Skeleton.Text lineWidth={120} lineHeight={16} dark />
          <div className="cards-rail">
            {CREDIT_CARDS.map((_, idx) => (
              <div key={`credit-card-${idx}`} className="credit-card-skeleton">
                <Skeleton.Box width={280} height={176} dark />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton.Text lineWidth={120} lineHeight={16} dark />
          <div className="cards-container">
            {CARD_SUBSCRIPTIONS.map((_, idx) => (
              <div key={`card-subscription-${idx}`} className="card-subscription-skeleton">
                <div className="cover">
                  <Skeleton.Box width="30%" height={14} dark />

                  <div className="tags">
                    <Skeleton.Box width="20%" height={14} dark />
                    <Skeleton.Box width="20%" height={14} dark />
                    <Skeleton.Box width="20%" height={14} dark />
                  </div>
                </div>

                <div className="content">
                  <Skeleton.Box width="45%" height={18} dark />
                  <Skeleton.Box width="20%" height={18} dark />
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
          min-height: 56px;
          background: var(--bg-0, #0a0a0f);
          border-bottom: 1px solid var(--line, #2a2a38);
        }

        .nav-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 8px 20px;
        }

        .logo {
          max-width: 100px;
          margin: 0;
        }

        .logo > img {
          width: 100%;
          height: auto;
          filter: brightness(0) invert(1);
          opacity: 0.4;
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
          width: 100%;
          max-width: 800px;
          padding: 20px 20px 48px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px 50px;
        }

        .hero-skel {
          width: 100%;
        }

        .cards-rail {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          padding: 4px 0 12px;
          overflow: hidden;
        }

        .credit-card-skeleton {
          flex: 0 0 auto;
        }

        .cards-container {
          width: 100%;
          min-height: 100%;
          display: grid;
          gap: 24px;
          place-content: start;
          grid-template-columns: minmax(280px, 1fr);
        }

        .card-subscription-skeleton {
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line, #2a2a38);
          border-radius: var(--r-md, 10px);
          height: 320px;
          overflow: hidden;
        }

        .card-subscription-skeleton .cover {
          background: var(--bg-3, #242433);
          border-bottom: 1px solid var(--line-strong, #3a3a4d);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
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
            grid-template-columns: repeat(2, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .container {
            max-width: 1440px;
          }

          .cards-container {
            grid-template-columns: repeat(3, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1280px) {
          .cards-container {
            grid-template-columns: repeat(4, minmax(260px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
