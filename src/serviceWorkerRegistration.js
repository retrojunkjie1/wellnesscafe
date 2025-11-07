// CRA-style service worker registration helper
// Adapted from: https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.\d{1,3}){3}$/
  )
);

export const register = (config)=>{
  if(process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator){
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if(publicUrl.origin !== window.location.origin){
      return; // Service worker won't work if PUBLIC_URL is on a different origin
    }

    window.addEventListener('load', ()=>{
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if(isLocalhost){
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(()=>{
          console.log('This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://cra.link/PWA');
        });
      }else{
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
};

const registerValidSW = (swUrl, config)=>{
  navigator.serviceWorker
    .register(swUrl)
    .then((registration)=>{
      registration.onupdatefound = ()=>{
        const installingWorker = registration.installing;
        if(installingWorker == null){return;}
        installingWorker.onstatechange = ()=>{
          if(installingWorker.state === 'installed'){
            if(navigator.serviceWorker.controller){
              // New content is available; please refresh.
              if(config && config.onUpdate){config.onUpdate(registration);}else{console.log('New content is available and will be used when all tabs are closed.');}
            }else{
              // Content is cached for offline use.
              if(config && config.onSuccess){config.onSuccess(registration);}else{console.log('Content is cached for offline use.');}
            }
          }
        };
      };
    })
    .catch((error)=>{
      console.error('Error during service worker registration:', error);
    });
};

const checkValidServiceWorker = (swUrl, config)=>{
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {headers:{'Service-Worker':'script'}})
    .then((response)=>{
      const contentType = response.headers.get('content-type');
      if(
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ){
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration)=>{
          registration.unregister().then(()=>{window.location.reload();});
        });
      }else{
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(()=>{
      console.log('No internet connection found. App is running in offline mode.');
    });
};

export const unregister = ()=>{
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then((registration)=>{
      registration.unregister();
    });
  }
};

export default {register, unregister};
