export const getSubscriptionObject = async (): Promise<string | null> => {
  //* navigator --> the core of service workers
  if ('serviceWorker' in navigator) {
    try {
      // * Getting the registration object
      const registration = await navigator.serviceWorker.ready;

      if ('pushManager' in registration) {
        // * using the registration object --> to get the subscription object
        const subscription = await registration.pushManager.getSubscription();

        // * Return subscription if not null
        return subscription !== null ? JSON.stringify(subscription) : null;
      }

      // * Push API not available
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    return null;
  }
};
