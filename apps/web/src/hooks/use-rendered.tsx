import { useEffect, useState } from 'react';

export function useRender() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isRendered: isClient,
  };
}
