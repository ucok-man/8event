'use client';

import { useEffect, useState } from 'react';

function calculateTimeLeft(targetDate: string | Date) {
  try {
    const target = new Date(targetDate);
    const now = Date.now();
    const difference = target.getTime() - now;

    if (difference <= 0) {
      return { hours: '00', minutes: '00', seconds: '00' };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  } catch (error) {
    console.error('Error calculating time:', error);
    return { hours: '00', minutes: '00', seconds: '00' };
  }
}

type Props = { target: string | Date };

export default function Timer({ target }: Props) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div>
      <div className="bg-gradient-to-r rounded-xl p-4 text-brand-blue-800 w-[320px]">
        <div className="flex justify-center items-center gap-2">
          <div className="text-center">
            <div className="text-xl font-bold font-mono grainy-dark border rounded-lg px-4 py-3">
              {timeLeft.hours}
            </div>
          </div>
          <div className="text-4xl font-bold">:</div>
          <div className="text-center">
            <div className="text-xl font-bold font-mono grainy-dark border rounded-lg px-4 py-3">
              {timeLeft.minutes}
            </div>
          </div>
          <div className="text-4xl font-bold">:</div>
          <div className="text-center">
            <div className="text-xl font-bold font-mono grainy-dark border rounded-lg px-4 py-3">
              {timeLeft.seconds}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-center w-full">Will be expired in</h2>
        </div>
      </div>
    </div>
  );
}
