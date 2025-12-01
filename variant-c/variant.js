// Test Configuration
const testInfo = {
  name: `CFXXX - Homepage: Resilient Hero Section Replacement`,
  id: `cf-hero-replacement-wrapper`,
};

// Initialize test and exit if already running
if (window.CF && window.CF.testsRunning && window.CF.testsRunning.find((t: any) => t.name === testInfo.name)) {
  return;
}
initTest(testInfo);

// Main Code
addStyling();
// Use a persistent observer to handle page re-rendering by continuously checking for the target element.
// The `onElementsFound` function is idempotent, ensuring changes are applied only once.
monitorChangesByConditionAndRun(checkForElements, onElementsFound, true);

// === MAIN FUNCTIONS ===

/**
 * The main function to apply changes to the page.
 * It's designed to be idempotent, meaning it can be called multiple times without causing issues.
 * It checks if the variant has already been applied before making any changes.
 */
function onElementsFound() {
  const heroSection = document.querySelector<HTMLElement>('#hero-section');

  // Idempotency check: exit if the target element doesn't exist or if our variant is already applied.
  if (!heroSection || document.getElementById(testInfo.id)) {
    return;
  }
  
  try {
    console.log(`Running Code for: `, testInfo.name);
    document.body.setAttribute(`cf-test-active`, testInfo.name);

    // Apply global style changes
    document.body.style.backgroundColor = '#fff';

    // Remove original background elements
    const bgDusk = document.querySelector('.HomeHero_hero-background-dusk__SZfbZ');
    if (bgDusk) bgDusk.remove();
    
    const bgDuskFg = document.querySelector('.HomeHero_hero-background-dusk-foreground__Im8SY');
    if (bgDuskFg) bgDuskFg.remove();

    // Clear existing hero content and render the new one within a wrapper.
    // The wrapper's ID is used for the idempotency check.
    heroSection.innerHTML = '';
    if (heroSection.parentElement) {
      heroSection.parentElement.style.marginTop = '0';
    }
    
    // Using a wrapper with a unique ID allows us to robustly check if the variant has been applied.
    const wrapper = <div id={testInfo.id}><NewHeroSection /></div>;
    heroSection.append(wrapper);

    // Emit variantRendered event only once.
    if (!window.CF?.testFlags?.[testInfo.name]?.hasRendered) {
      window.CFQ = window.CFQ || [];
      window.CFQ.push({ emit: 'variantRendered' });
      
      if (window.CF && window.CF.testFlags) {
          window.CF.testFlags[testInfo.name] = { hasRendered: true };
      }
    }
  } catch (error) {
    console.error(`Error in onElementsFound for ${testInfo.name}:`, error);
  }
}

/**
 * Checks for the presence of the necessary elements before running the main logic.
 * @returns {boolean} - True if the required elements are found, false otherwise.
 */
function checkForElements() {
  // We only need to check for the original hero section container.
  // The onElementsFound function handles the idempotency check internally.
  return !!document.querySelector('#hero-section');
}

/**
 * JSX component for the new hero section content.
 */
function NewHeroSection() {
  return (
    <div className="cf:w-full cf:bg-white cf:pb-20">
      <div className="cf:mx-auto cf:max-w-7xl cf:px-6 cf:lg:px-8">
        <div className="cf:rounded-3xl cf:bg-gray-50 cf:p-8 cf:sm:p-14">
          <div className="cf:max-w-3xl cf:mx-auto cf:text-center">
            {/* Desktop Image */}
            <img
              className="cf:max-w-full cf:h-auto cf:mx-auto cf:mb-8 cf:hidden cf:min-[425px]:block"
              src="https://cdn.coframe.com/assets/ramp/small-business-card-bac98891-1e02-4cb1-a5b2-defc1800e3b4.webp"
              alt="Ramp card transaction"
            />
            {/* Mobile Image */}
            <img
              className="cf:max-w-full cf:h-auto cf:mx-auto cf:mb-8 cf:block cf:min-[425px]:hidden"
              src="https://cdn.coframe.com/assets/ramp/mob-small-business-card-0734dace-0964-4d2c-86ee-760bfb2981af.webp"
              alt="Ramp card transaction on mobile"
            />
            <h1 className="cf:text-4xl cf:font-bold cf:tracking-tight cf:text-gray-900 cf:sm:text-6xl">
              The money app that works for you
            </h1>
            <p className="cf:mt-6 cf:text-lg cf:leading-8 cf:text-gray-600">
              Managing money is hard, but you don't have to do it alone. Rocket Money empowers you to save more, spend less, see everything, and take back control of your financial life.
            </p>
            <div className="cf:mt-10 cf:flex cf:items-center cf:justify-center cf:gap-x-6">
              <a
                href="#"
                className="cf:rounded-md cf:bg-black cf:px-4 cf:py-3 cf:text-sm cf:font-semibold cf:text-white cf:shadow-sm cf:hover:bg-gray-800 cf:focus-visible:outline cf:focus-visible:outline-2 cf:focus-visible:outline-offset-2 cf:focus-visible:outline-black"
              >
                Get started for free
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === HELPER FUNCTIONS ===

/**
 * Adds custom CSS to the page for styling elements targeted by the variant.
 */
function addStyling() {
  const cssArray = [
    {
      desc: `Header override styles for light theme`,
      css: `
        .NavbarClient_navbarReverse__FS_oJ {
          color: oklch(0.1465 0.0057 69.2) !important;
          border-bottom-color: rgba(0, 0, 0, 0.1) !important;
        }
        .NavbarClient_navbarReverse__FS_oJ a,
        .NavbarClient_navbarReverse__FS_oJ button {
          color: oklch(0.1465 0.0057 69.2) !important;
        }
         .NavbarClient_navbarReverse__FS_oJ button:hover {
            background-color: rgba(0,0,0,0.05) !important;
         }
        .NavbarClient_navbarReverse__FS_oJ a[href="/see-a-demo"] {
            background-color: #f6fab2 !important;
            color: oklch(0.1465 0.0057 69.2) !important;
        }
        .NavbarClient_navbarReverse__FS_oJ a[href="https://app.ramp.com/sign-in"] {
            border: 1px solid rgba(0,0,0,0.2);
        }
      `,
    },
  ];

  cssArray.forEach(({ desc, css }) => {
    let newStyleElem = document.createElement(`style`);
    newStyleElem.dataset.desc = desc;
    newStyleElem.innerHTML = css;
    document.head.insertAdjacentElement(`beforeend`, newStyleElem);
  });
}

/**
 * Monitors DOM changes and runs a callback function when a condition is met.
 * @param {() => boolean} check - A function that returns true when the condition is met.
 * @param {() => void} code - The callback function to execute.
 * @param {boolean} [keepChecking=false] - If true, the observer will not be disconnected after the code runs.
 */
function monitorChangesByConditionAndRun(check: () => boolean, code: () => void, keepChecking = false) {
  const checkAndRun = () => {
    if (check()) {
      if (!keepChecking) {
        observer.disconnect();
      }
      code();
    }
  };

  const observer = new MutationObserver(checkAndRun);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  checkAndRun(); // Run once immediately

  if (!keepChecking) {
    setTimeout(() => observer.disconnect(), 10000); // 10s killswitch
  }
}

/**
 * Initializes the test by setting up a global object for tracking.
 * @param {object} testInfo - An object containing the test name.
 * @returns {object|boolean} - The global CF object or false if the test is already running.
 */
function initTest(testInfo: { name: string, id: string }) {
  let cfObj = window.CF || { qaTesting: false, testsRunning: [], testFlags: {} };

  if (cfObj.testsRunning.find((test: any) => test.name === testInfo.name)) {
    console.warn(`The following test is already running: `, testInfo);
    return false;
  }

  cfObj.testsRunning.push(testInfo);
  cfObj.testFlags = cfObj.testFlags || {};
  
  window.CF = { ...window.CF, ...cfObj };
  return window.CF;
}

declare global {
  interface Window {
    CF?: any;
    CFQ?: any[];
  }
}
