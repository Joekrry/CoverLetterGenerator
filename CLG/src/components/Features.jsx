import './Features.css';

const cvs = [
  { name: 'Olivia Bennett', role: 'Marketing Manager', accent: '#FF5030' },
  { name: 'James Carter', role: 'Software Engineer', accent: '#1A73E8' },
  { name: 'Sophia Nguyen', role: 'UX Designer', accent: '#0F9D58' },
  { name: 'Liam Patel', role: 'Data Analyst', accent: '#6A4C93' },
  { name: 'Emma Thompson', role: 'Project Manager', accent: '#E84393' },
  { name: 'Noah Williams', role: 'Accountant', accent: '#00838F' },
  { name: 'Ava Martinez', role: 'Graphic Designer', accent: '#D35400' },
  { name: 'William Chen', role: 'Product Manager', accent: '#2C3E50' },
  { name: 'Isabella Rossi', role: 'HR Specialist', accent: '#8E44AD' },
  { name: 'Ethan Brown', role: 'Sales Executive', accent: '#16A085' },
  { name: 'Mia Johansson', role: 'Architect', accent: '#C0392B' },
  { name: 'Lucas Muller', role: 'Mechanical Engineer', accent: '#2980B9' },
  { name: 'Charlotte Davies', role: 'Content Writer', accent: '#27AE60' },
  { name: 'Henry Wilson', role: 'Financial Analyst', accent: '#F39C12' },
  { name: 'Amelia Clarke', role: 'Nurse Practitioner', accent: '#34495E' },
  { name: 'Oliver Garcia', role: 'DevOps Engineer', accent: '#E67E22' },
  { name: 'Grace Kim', role: 'Business Analyst', accent: '#1ABC9C' },
  { name: 'Jack Robinson', role: 'Civil Engineer', accent: '#9B59B6' },
  { name: 'Chloe Dubois', role: 'Brand Strategist', accent: '#3498DB' },
  { name: 'Daniel Okafor', role: 'Research Scientist', accent: '#E74C3C' },
].map((cv, id) => ({ ...cv, id, layout: ['left-sidebar', 'header-band', 'two-column', 'right-sidebar', 'minimal'][id % 5] }));

const VIEW_W = 240;
const VIEW_H = 320;
const LINE = '#E3E6EB';
const LINE_DARK = '#C9CFD8';
const TEXT = '#2A2F3A';
const SIDE_TITLE = 'rgba(255, 255, 255, 0.85)';
const SIDE_LINE = 'rgba(255, 255, 255, 0.5)';

// A stack of rounded rectangles standing in for lines of body text.
const Lines = ({ x, y, count, widths, gap = 7, h = 4, color = LINE }) =>
  Array.from({ length: count }).map((_, i) => (
    <rect
      key={i}
      x={x}
      y={y + i * (h + gap)}
      width={Array.isArray(widths) ? widths[i % widths.length] : widths}
      height={h}
      rx={2}
      fill={color}
    />
  ));

const SectionTitle = ({ x, y, w = 48, color }) => (
  <rect x={x} y={y} width={w} height={5} rx={2} fill={color} />
);

const LeftSidebar = ({ name, role, accent }) => (
  <>
    <rect width={84} height={VIEW_H} fill={accent} />
    <circle cx={42} cy={50} r={24} fill="#ffffff" opacity="0.95" />
    <SectionTitle x={16} y={92} w={42} color={SIDE_TITLE} />
    <Lines x={16} y={104} count={3} widths={[52, 46, 38]} color={SIDE_LINE} />
    <SectionTitle x={16} y={168} w={42} color={SIDE_TITLE} />
    <Lines x={16} y={180} count={3} widths={[52, 44, 48]} color={SIDE_LINE} />
    <SectionTitle x={16} y={244} w={42} color={SIDE_TITLE} />
    <Lines x={16} y={256} count={2} widths={[52, 40]} color={SIDE_LINE} />
    <text x={100} y={44} fontSize={11} fontWeight="700" fill={TEXT}>{name}</text>
    <text x={100} y={60} fontSize={7} fontWeight="600" letterSpacing="1" fill={accent}>{role.toUpperCase()}</text>
    <rect x={100} y={70} width={124} height={2} fill={accent} />
    <SectionTitle x={100} y={86} color={accent} />
    <Lines x={100} y={98} count={4} widths={[124, 118, 124, 96]} />
    <SectionTitle x={100} y={164} color={accent} />
    <Lines x={100} y={176} count={4} widths={[120, 124, 108, 124]} />
    <SectionTitle x={100} y={242} color={accent} />
    <Lines x={100} y={254} count={2} widths={[124, 90]} />
  </>
);

const RightSidebar = ({ name, role, accent }) => (
  <>
    <rect x={156} width={84} height={VIEW_H} fill={accent} />
    <circle cx={198} cy={50} r={24} fill="#ffffff" opacity="0.95" />
    <SectionTitle x={172} y={92} w={42} color={SIDE_TITLE} />
    <Lines x={172} y={104} count={3} widths={[52, 46, 38]} color={SIDE_LINE} />
    <SectionTitle x={172} y={168} w={42} color={SIDE_TITLE} />
    <Lines x={172} y={180} count={3} widths={[52, 44, 48]} color={SIDE_LINE} />
    <SectionTitle x={172} y={244} w={42} color={SIDE_TITLE} />
    <Lines x={172} y={256} count={2} widths={[52, 40]} color={SIDE_LINE} />
    <text x={16} y={44} fontSize={11} fontWeight="700" fill={TEXT}>{name}</text>
    <text x={16} y={60} fontSize={7} fontWeight="600" letterSpacing="1" fill={accent}>{role.toUpperCase()}</text>
    <rect x={16} y={70} width={124} height={2} fill={accent} />
    <SectionTitle x={16} y={86} color={accent} />
    <Lines x={16} y={98} count={4} widths={[124, 118, 124, 96]} />
    <SectionTitle x={16} y={164} color={accent} />
    <Lines x={16} y={176} count={4} widths={[120, 124, 108, 124]} />
    <SectionTitle x={16} y={242} color={accent} />
    <Lines x={16} y={254} count={2} widths={[124, 90]} />
  </>
);

const HeaderBand = ({ name, role, accent }) => (
  <>
    <rect width={VIEW_W} height={82} fill={accent} />
    <circle cx={200} cy={41} r={22} fill="#ffffff" opacity="0.95" />
    <text x={16} y={40} fontSize={13} fontWeight="700" fill="#ffffff">{name}</text>
    <text x={16} y={58} fontSize={7.5} fontWeight="600" letterSpacing="1" fill={SIDE_TITLE}>{role.toUpperCase()}</text>
    <SectionTitle x={16} y={104} color={accent} />
    <Lines x={16} y={116} count={4} widths={[208, 196, 208, 150]} />
    <SectionTitle x={16} y={184} color={accent} />
    <Lines x={16} y={196} count={4} widths={[200, 208, 184, 208]} />
    <SectionTitle x={16} y={258} color={accent} />
    <Lines x={16} y={270} count={2} widths={[208, 140]} />
  </>
);

const Minimal = ({ name, role, accent }) => (
  <>
    <text x={120} y={48} fontSize={13} fontWeight="700" fill={TEXT} textAnchor="middle">{name}</text>
    <text x={120} y={65} fontSize={7.5} fontWeight="600" letterSpacing="1.5" fill={accent} textAnchor="middle">{role.toUpperCase()}</text>
    <rect x={90} y={76} width={60} height={2} fill={accent} />
    <SectionTitle x={24} y={100} color={accent} />
    <Lines x={24} y={112} count={4} widths={[192, 180, 192, 150]} />
    <SectionTitle x={24} y={180} color={accent} />
    <Lines x={24} y={192} count={4} widths={[188, 192, 168, 192]} />
    <SectionTitle x={24} y={258} color={accent} />
    <Lines x={24} y={270} count={2} widths={[192, 130]} />
  </>
);

const TwoColumn = ({ name, role, accent }) => (
  <>
    <text x={16} y={40} fontSize={13} fontWeight="700" fill={TEXT}>{name}</text>
    <text x={16} y={57} fontSize={7.5} fontWeight="600" letterSpacing="1" fill={accent}>{role.toUpperCase()}</text>
    <rect x={16} y={68} width={208} height={2} fill={accent} />
    <SectionTitle x={16} y={86} color={accent} />
    <Lines x={16} y={98} count={5} widths={[96, 88, 96, 74, 96]} />
    <SectionTitle x={128} y={86} color={accent} />
    <Lines x={128} y={98} count={5} widths={[96, 80, 96, 90, 70]} />
    <SectionTitle x={16} y={198} color={accent} />
    <Lines x={16} y={210} count={4} widths={[96, 90, 96, 78]} />
    <SectionTitle x={128} y={198} color={accent} />
    <Lines x={128} y={210} count={4} widths={[96, 84, 96, 88]} color={LINE_DARK} />
  </>
);

const LAYOUTS = {
  'left-sidebar': LeftSidebar,
  'right-sidebar': RightSidebar,
  'header-band': HeaderBand,
  minimal: Minimal,
  'two-column': TwoColumn,
};

const CVThumbnail = ({ cv }) => {
  const Layout = LAYOUTS[cv.layout];
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${cv.name}, ${cv.role} CV template`}
      fontFamily="Inter, sans-serif"
    >
      <rect width={VIEW_W} height={VIEW_H} fill="#ffffff" />
      <Layout name={cv.name} role={cv.role} accent={cv.accent} />
    </svg>
  );
};

const Features = () => {
  const rowOne = cvs;
  const rowTwo = cvs.slice().reverse();

  return (
    <section className="features-section" id="features">
      <div className="scroll-container">
        {/* First row - scrolls left to right */}
        <div className="scroll-row scroll-left">
          <div className="scroll-content">
            {[...rowOne, ...rowOne].map((cv, index) => (
              <div key={`row1-${index}`} className="cv-card">
                <CVThumbnail cv={cv} />
              </div>
            ))}
          </div>
        </div>

        {/* Second row - scrolls right to left */}
        <div className="scroll-row scroll-right">
          <div className="scroll-content">
            {[...rowTwo, ...rowTwo].map((cv, index) => (
              <div key={`row2-${index}`} className="cv-card">
                <CVThumbnail cv={cv} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
