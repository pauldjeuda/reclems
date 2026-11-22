import { ImageResponse } from 'next/og';
export const alt = 'Initiative citoyenne — qualité des télécommunications au Cameroun';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#f4f4f4',
        color: '#0b0b0b',
        padding: '70px',
        fontFamily: 'Arial',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '760px' }}>
        <div style={{ fontSize: 24, color: '#555', marginBottom: 28 }}>
          INITIATIVE CITOYENNE · CAMEROUN
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 70,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-3px'
          }}
        >
          <span>Orange Cameroun :</span>
          <span>un service à la hauteur</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 25, color: '#555' }}>
          Une pétition pour un réseau fiable et des tarifs plus justes.
        </div>
      </div>
      <div
        style={{
          width: 210,
          height: 210,
          borderRadius: 36,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 42,
          fontWeight: 500
        }}
      >
        ● ● ●
      </div>
    </div>,
    size
  );
}
