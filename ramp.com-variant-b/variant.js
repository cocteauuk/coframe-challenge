// Test Configuration
let testInfo = {
  name: `CF 01 - Ramp Home: Insert "How it works" 3-card section between logos and Product Suite`,
};

// Initialize test and exit if already running
let testInitiated = initTest(testInfo);
if (!testInitiated) exportDefaultFalse();

// Main Code
addStyling(); // No custom CSS needed now, but function kept for consistency
monitorChangesByConditionAndRun(checkForElements, onElementsFound);

// === MAIN FUNCTIONS ===

function onElementsFound() {
  try {
    console.log(`Running Code for: `, testInfo.name, testInfo);
    document.querySelector(`body`)?.setAttribute(`cf-test-active`, testInfo.name);

    // Anchor: find the Product Suite section and insert our new section right before it
    const productSuiteGrid = document.querySelector('#product-suite-new') as HTMLElement | null;
    const productSuiteSection = productSuiteGrid?.closest('section') as HTMLElement | null;
    if (!productSuiteSection) throw new Error('Product Suite section not found');

    // Idempotency: do not re-insert if already present
    if (document.getElementById('cf-how-it-works')) {
      console.warn('How it works section already inserted');
    } else {
      productSuiteSection.insertAdjacentElement('beforebegin', <HowItWorksSection />);
    }

    // Inform Coframe SDK the variant has finished rendering
    window.CFQ = (window.CFQ || []) as any[];
    window.CFQ.push({ emit: 'variantRendered' });
  } catch (e) {
    console.error('Variant error:', e);
  }
}

function checkForElements() {
  // Check for required elements before running code
  try {
    const cfDefined = typeof window.CF !== 'undefined';
    const productSuiteGrid = document.querySelector('#product-suite-new');
    const notAlreadyInserted = !document.getElementById('cf-how-it-works');

    console.log('Check: CF defined =>', cfDefined);
    console.log('Check: #product-suite-new exists =>', !!productSuiteGrid);
    console.log('Check: how-it-works not yet inserted =>', notAlreadyInserted);

    return cfDefined && !!productSuiteGrid && notAlreadyInserted;
  } catch (e) {
    console.error('Check error:', e);
    return false;
  }
}

// === COMPONENTS (TSX with DOM-only runtime) ===

// Section wrapper with heading and 3-card grid
function HowItWorksSection() {
  return (
    <section id="cf-how-it-works" className="bg-white spacer-p-t-l">
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[468px] text-center lg:mx-0 lg:text-left">
          {/* Kicker/eyebrow */}
          <div className="leading-trim body-s text-hushed">
            How it works
          </div>
          <h2 className="leading-trim headline-l mt-6">
            Get set up in three simple steps
          </h2>
          <p className="leading-trim body-m text-hushed mt-6 lg:mt-8">
            Connect your tools, set policies that run themselves, and issue cards in minutes.
          </p>
        </div>

        {/* 3-column cards */}
        <div className="cf:mt-10 gap-6 md:grid md:grid-cols-2 md:gap-y-10 lg:grid-cols-3 xl:grid-cols-3">
          <HowItWorksCard
            step="Step 1"
            title="Connect your systems"
            body="Plug Ramp into your ERP, HRIS, email, banks, and 200+ integrations so data flows automatically."
            imgSrc="https://cdn.coframe.com/assets/temp/ramp/image-9c7c8ef4-a1b6-47f3-bc4d-5abf04b96b60.webp"
            imgAlt="Integration and invoice mockup"
          />
          <HowItWorksCard
            step="Step 2"
            title="Set up policies"
            body="Create approval flows, limits, and controls that enforce themselves—no chasing or manual checks."
            imgSrc="https://cdn.coframe.com/assets/temp/ramp/image-6d5032a9-4acc-4eca-a097-f7db77d84a46.webp"
            imgAlt="List and control mockup"
          />
          <HowItWorksCard
            step="Step 3"
            title="Issue cards"
            body="Instantly issue virtual and physical cards with built‑in controls to keep spend in policy."
            imgSrc="https://cdn.coframe.com/assets/temp/ramp/image-9c7c8ef4-a1b6-47f3-bc4d-5abf04b96b60.webp"
            imgAlt="Card mockup"
          />
        </div>
      </div>
    </section>
  );
}

// Single card
function HowItWorksCard(props: { step: string; title: string; body: string; imgSrc: string; imgAlt: string }) {
  const { step, title, body, imgSrc, imgAlt } = props;

  return (
    <div className="bg-grayLight rounded-xl overflow-hidden">
      <div className="cf:p-6">
        {/* White inner mockup box */}
        <div className="cf:bg-white cf:rounded-lg cf:border cf:border-black-100 cf:overflow-hidden cf:aspect-[16/10] cf:flex cf:items-center cf:justify-center">
          <img
            src={imgSrc}
            alt={imgAlt}
            width={1200}
            height={800}
            className="cf:w-full cf:h-full cf:object-contain"
            loading="lazy"
          />
        </div>

        {/* Text content below */}
        <div className="cf:mt-6 cf:space-y-2">
          <div className="leading-trim body-xs text-hushed">{step}</div>
          <div className="leading-trim body-xl text-primary">{title}</div>
          <div className="leading-trim body-s text-hushed">{body}</div>
        </div>
      </div>
    </div>
  );
}

// === HELPER FUNCTIONS ===
function addStyling() {
  // No custom CSS required. Tailwind utilities with cf: prefix are used for variant elements.
  // This function is kept in case a later iteration needs scoped CSS.
}

function monitorChangesByConditionAndRun(check: () => boolean, code: () => void, keepChecking = false) {
  let checkAndRun = () => {
    try {
      if (check()) {
        if (!keepChecking) observer.disconnect();
        code();
      }
    } catch (e) {
      console.error('monitor error:', e);
    }
  };
  const observer = new MutationObserver(checkAndRun);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  checkAndRun(); // Run once immediately

  // 10s observer killswitch
  if (!keepChecking) setTimeout(() => observer.disconnect(), 10000);
}

function initTest() {
  // Obtain or Create Object For Tests
  let cfObj = (window.CF || { qaTesting: false, testsRunning: [] }) as any;

  // Check Whether Test Is Already Running
  if (cfObj.testsRunning.find((test: any) => test.name == testInfo.name)) {
    console.warn(`The following test is already running: `, testInfo);
    return false;
  }

  // Add Test to List of Running Tests
  cfObj.testsRunning = [...cfObj.testsRunning, testInfo];

  // Update Global Object
  (window as any).CF = { ...window.CF, ...cfObj };

  return { ...(window as any).CF };
}

// Helper to avoid top-level return in TSX file
function exportDefaultFalse() {
  // no-op; keeps TSX valid if early exit is needed
}

declare global {
  interface Window {
    CF?: any;
    CFQ?: any[];
  }
}
