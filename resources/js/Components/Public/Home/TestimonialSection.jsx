import { useState } from 'react'; 
import { Carousel } from 'react-bootstrap';

const TestimonialSection = () => {
  const testimonials = [
    { name: 'Maya L., UX Designer', message: 'SkillVilla helped me land my first freelance gig in just 3 days. The community is so helpful and active!' },
    { name: 'John D., Web Developer', message: 'A refreshing alternative to traditional networking sites. I found a tech co-founder here!' },
    { name: 'Sophia R., Digital Marketer', message: 'Finally, a platform that gets how freelancers work. I’ve grown my client list faster than ever.' },
    { name: 'Arjun P., Product Manager', message: 'SkillVilla makes networking less awkward and more real. I’ve met talented people I now work with!' },
    { name: 'Ella K., Frontend Engineer', message: 'The design is beautiful, the vibe is supportive, and the projects I found here really challenged me.' },
    { name: 'Carlos M., Chef', message: 'I never thought I’d find private catering gigs online like this. Amazing platform!' },
    { name: 'Nina S., Graphic Designer', message: 'It’s so much easier to find genuine creative projects here. My portfolio is thriving!' },
    { name: 'James T., Music Producer', message: 'Collaborated with indie artists through SkillVilla. It’s been a game-changer for my studio.' },
    /*{ name: 'Aisha B., Content Strategist', message: 'A refreshing break from algorithm-heavy platforms. More human, more helpful.' },
    { name: 'Ravi K., Fitness Coach', message: 'I’ve booked sessions with clients around the world thanks to this platform.' },
    { name: 'Lena G., SEO Specialist', message: 'High-quality leads and teams that value expertise. That’s a win for me.' },
    { name: 'Tom H., Life Coach', message: 'The exposure and connections I got through SkillVilla helped launch my coaching business.' },
    { name: 'Daria V., Motion Graphics Artist', message: 'Way better than any job board I’ve used. Feels more personal and direct.' },
    { name: 'Ali C., Photographer', message: 'Found destination weddings and commercial shoots. Never thought it’d be this easy!' },
    { name: 'Emily R., Illustrator', message: 'Clients actually respond! That’s rare in freelance platforms these days.' },
    { name: 'Chris N., Language Tutor', message: 'I teach students from 6 different countries now. SkillVilla opened doors!' },
    { name: 'Zara W., Copywriter', message: 'Met a startup founder through SkillVilla. Now I’m their brand voice.' },
    { name: 'Leo M., Interior Designer', message: 'I landed 3 major remote projects — one even overseas. Truly global reach!' },
    { name: 'Tina F., Fashion Stylist', message: 'Styled two magazine shoots after connecting here. Love this community!' },
    { name: 'Omar Y., Motivational Speaker', message: 'Booked 5 talks at startups last quarter. SkillVilla helped amplify my voice.' },*/
  ];

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <section className="py-5 testimonialSection">
      <h2 className="text-center fw-bold mb-2">What People Are Saying</h2>
      
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={5000}
        controls={false}
        indicators={false}
        data-bs-theme="dark"
      >
        {testimonials.map((item, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center align-items-center px-2" style={{ minHeight: '200px' }}>
              <div className="p-4   rounded-3	   text-center testimonial"  >
                <p className="mb-3   fst-italic">"{item.message}"</p>
                <h6 className="mb-0 fw-bold">— {item.name}</h6>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Indicators */}
      <div className="d-flex justify-content-center mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`mx-2 rounded-circle border-0`}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: index === i ? '#000' : '#ccc',
              transition: 'background-color 0.3s ease',
            }}
						id={`indicator_${i + 1}`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
