/** The picture a shared link shows: the line, the sun, a row of panels, in Orina's colours. */
import { ImageResponse } from 'next/og';

export const alt = 'Orina Grid: your roof can pay your electricity bill';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#F7F6F2',
        padding: '72px 80px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 90,
          width: 150,
          height: 150,
          borderRadius: 999,
          background: 'radial-gradient(circle, #F5C266 0%, #E8A33D 60%, rgba(232,163,61,0) 100%)',
        }}
      />
      <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#62697A' }}>
        ORINA GRID · GUJARAT
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 92,
          lineHeight: 1.02,
          letterSpacing: -3,
          color: '#0B0B0D',
          maxWidth: 900,
        }}
      >
        Your roof can pay your electricity bill.
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: 28, color: '#62697A' }}>
          A trusted partner in your district
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ width: 64, height: 40, background: '#2340E8', transform: 'skewX(-12deg)' }}
            />
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
