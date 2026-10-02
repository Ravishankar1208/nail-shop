import { Link } from 'react-router-dom';
import Button from '../component/Buttom';
import ImageWithFallback from '../component/ImageWithFallback';
import aboutImage from '../assets/about-nail-styling.svg';

function About() {
  return (
    <div className="container page-section about-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Our brand</p>
          <h1>Beauty in every shade.</h1>
        </div>
      </div>

      <section className="about-story split-layout">
        <div>
          <h2>Crafted for confident self-expression.</h2>
          <p>
            Nail Atelier was created for the modern beauty lover who wants every detail of their look to feel considered,
            intentional, and effortlessly elevated. We design premium shades with the art of self-expression at heart.
          </p>
          <p>
            From timeless nudes to statement burgundies and soft florals, our palette helps you express who you are with
            every manicure.
          </p>
        </div>
        <div className="image-panel">
          <ImageWithFallback
            src={aboutImage}
            alt="Nail product styling"
            className="image-panel-image"
          />
        </div>
      </section>

      <section className="about-grid">
        <div className="info-card">
          <p className="eyebrow">Our story</p>
          <h3>From intimate rituals to standout beauty moments.</h3>
          <p>
            We started with a simple idea: beauty products should feel luxurious without being intimidating, polished without
            being overdone, and expressive without losing elegance.
          </p>
        </div>
        <div className="info-card">
          <p className="eyebrow">Our philosophy</p>
          <h3>Color should feel personal, never forced.</h3>
          <p>
            Every formula is selected for smooth finish, rich depth, and long wear so that beauty feels easy and effortless.
          </p>
        </div>
        <div className="info-card">
          <p className="eyebrow">Quality</p>
          <h3>Premium ingredients, luminous results.</h3>
          <p>
            We focus on quality ingredients, high-performing pigments, and a beauty-first aesthetic to bring a salon finish
            into your everyday routine.
          </p>
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <p className="eyebrow">Made for every shade</p>
          <h2>Elegant color for every mood, moment, and memory.</h2>
        </div>
        <Link to="/shop">
          <Button>Shop the Collection</Button>
        </Link>
      </section>
    </div>
  );
}

export default About;
