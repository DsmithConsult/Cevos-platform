export default function EngineeringRecommendations({
  recommendations,
}) {
  return (
    <>
      <h2>Engineering Recommendations</h2>

      <ul>
        {recommendations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}