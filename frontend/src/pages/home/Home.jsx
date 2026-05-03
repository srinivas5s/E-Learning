import Hero from "../../components/sections/Hero.jsx";
import Stats from "../../components/sections/Stats.jsx";
import Features from "../../components/sections/Features.jsx";
import CoursesPreview from "../../components/sections/CoursesPreview.jsx";
import Testimonials from "../../components/sections/Testimonials.jsx";
import CTA from "../../components/sections/CTA.jsx";

const Home = () => {
    return (
        <div style={{ backgroundColor: "var(--color-bg)" }}>
            <Hero />
            <Stats />
            <Features />
            <CoursesPreview />
            <Testimonials />
            <CTA />
        </div>
    );
};

export default Home;