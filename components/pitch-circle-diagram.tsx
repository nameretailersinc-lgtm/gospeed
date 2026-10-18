/** Exact pin-center geometry; this is not a manufacturing tooth-profile drawing. */
export function PitchCircleDiagram() {
  const pins = Array.from({length:12}, (_,i) => {
    const angle=(-105+i*30)*Math.PI/180;
    return {x:160+112*Math.cos(angle), y:150+112*Math.sin(angle)};
  });
  return <figure className="pitch-geometry"><svg viewBox="0 0 320 310" role="img" aria-labelledby="pitch-diagram-title pitch-diagram-desc">
    <title id="pitch-diagram-title">Pitch circle and a single chain-pitch chord</title>
    <desc id="pitch-diagram-desc">Twelve equally spaced pin centers lie on a circle of radius R. A straight chord of length p joins adjacent pins. Their angle at the center is 2π/N. Pitch diameter is twice R.</desc>
    <circle cx="160" cy="150" r="112" fill="none" stroke="#7b9bd4" strokeDasharray="5 5"/>
    <polygon points={pins.map(p=>`${p.x},${p.y}`).join(' ')} fill="#e8f1ff" stroke="#103b80" strokeWidth="2"/>
    <path d={`M${pins[0].x},${pins[0].y} L160,150 L${pins[1].x},${pins[1].y}`} stroke="#0066ff" strokeWidth="2" fill="none"/>
    <line x1="160" y1="150" x2="272" y2="150" stroke="#103b80" strokeWidth="2"/>
    {pins.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="5" fill="#0066ff"/>)}
    <circle cx="160" cy="150" r="5" fill="#103b80"/>
    <path d="M131 22V10H189V22" stroke="#103b80" fill="none"/>
    <text x="160" y="8" textAnchor="middle">p</text><text x="212" y="142">R</text><text x="166" y="102">2π/N</text>
    <text x="160" y="292" textAnchor="middle">D = 2R · p = 2R sin(π/N)</text>
  </svg><figcaption>Pin-center geometry · 12-tooth illustration</figcaption></figure>;
}
