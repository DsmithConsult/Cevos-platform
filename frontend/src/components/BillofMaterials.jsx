export default function BillOfMaterials({
  bom,
}) {
  return (
    <>
      <h2>Bill of Materials (BOM)</h2>

      <ul>
        {bom.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}