const creditLines = [
  <>
    Created by <a href="https://officiallysp.net">OfficiallySp</a> · <a href="https://officiallysp.net">More projects</a>
  </>,
  'Track referencing + additional coding by Tactoe',
  'Real time support by mattmora',
  'Additional Contributions by mayopon',
  <>
    TFT / LoL universe made by <a href="https://www.riotgames.com/en">Riot Games</a>
  </>,
  '© Shane Pepperell 2023 - 2024'
];

export default function Credits() {
  return (
    <>
      <hr />
      <h3>Credits:</h3>
      {creditLines.map((line, index) => (
        <h4 key={index}>{line}</h4>
      ))}
    </>
  );
}
