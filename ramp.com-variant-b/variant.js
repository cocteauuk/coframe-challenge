// Helper function to wait for an element to be available in the DOM
function monitorChangesByConditionAndRun(
  condition: () => boolean,
  callback: () => void,
  disconnectAfterRun: boolean = true,
) {
  const observer = new MutationObserver((mutations, obs) => {
    if (condition()) {
      callback();
      if (disconnectAfterRun) {
        obs.disconnect();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (condition()) {
    callback();
    if (disconnectAfterRun) {
      observer.disconnect();
    }
  }
}

/**
 * Main function to apply changes.
 */
function applyVariant() {
  const productSuiteSection = document.querySelector('section.bg-white.spacer-p-t-l');
  if (!productSuiteSection || !productSuiteSection.parentElement) {
    console.error('Target section for insertion not found');
    return;
  }

  if (document.querySelector('#cf-how-it-works')) {
    console.log('Variant section already exists.');
    return;
  }

  productSuiteSection.parentElement.insertBefore(
    <HowItWorksSection />,
    productSuiteSection,
  );

  window.CFQ = window.CFQ || [];
  window.CFQ.push({ emit: 'variantRendered' });
}

const isReady = () => document.querySelector('section.bg-white.spacer-p-t-l') !== null;

monitorChangesByConditionAndRun(isReady, applyVariant);

function HowItWorksSection() {
  return (
    <section id="cf-how-it-works" className="cf:bg-white cf:py-16 cf:px-4 cf:sm:px-6 cf:lg:py-20 cf:lg:px-8">
      <div className="cf:max-w-7xl cf:mx-auto">
        <div className="cf:text-center">
          <h2 className="cf:text-4xl cf:font-bold cf:text-gray-900">
            How it works
          </h2>
          <p className="cf:mt-4 cf:text-lg cf:text-gray-600">
            Get up and running in a few simple steps.
          </p>
        </div>
        <div className="cf:mt-16 cf:grid cf:grid-cols-1 cf:gap-y-12 cf:sm:grid-cols-2 cf:md:grid-cols-4 cf:gap-x-8">
          <Step
            icon="user-plus"
            number={1}
            title="Sign Up"
            description="Create your account in minutes. No lengthy paperwork."
          />
          <Step
            icon="credit-card"
            number={2}
            title="Issue Cards"
            description="Instantly issue virtual and physical cards to your team."
          />
          <Step
            icon="settings-2"
            number={3}
            title="Set Controls"
            description="Customize spending limits and rules for every card."
          />
          <Step
            icon="trending-up"
            number={4}
            title="Start Saving"
            description="Track spending in real-time and find savings opportunities."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ icon, number, title, description }: {
  icon: string;
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="cf:text-center cf:md:text-left">
      <div className="cf:flex cf:items-center cf:justify-center cf:md:justify-start">
        <div className="cf:flex cf:items-center cf:justify-center cf:size-12 cf:rounded-lg cf:border cf:border-gray-400">
          <i data-lucide={icon} className="cf:size-6 cf:text-gray-900" />
        </div>
      </div>
      <div className="cf:mt-5">
        <h3 className="cf:text-lg cf:font-semibold cf:text-gray-900">
          {number}. {title}
        </h3>
        <p className="cf:mt-2 cf:text-base cf:text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
