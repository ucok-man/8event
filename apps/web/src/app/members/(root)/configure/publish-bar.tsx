'use client';

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth-provider';
import { useCreateEventContext } from '@/context/create-event-provider';
import { refetchNow } from '@/context/query-provider';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Award, PartyPopper, RotateCw, Save } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';
import { useState, useTransition } from 'react';
import Confetti from 'react-dom-confetti';

export default function PublishBar() {
  const { apiclient } = useAuthContext();

  const {
    payload,
    updateBannerError,
    updateCreateEventError,
    updateCreateTicketError,
    setStorageToDefault,
  } = useCreateEventContext();
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [intend, setIntend] = useState<'Publish' | 'Save'>('Save');
  const { isPending, mutate: publish } = useMutation({
    mutationFn: async (intend: 'Publish' | 'Save') => {
      const dto = {
        event: {
          ...payload.createEvent.data,
          bannerUrl: payload.uploadBanner.data?.bannerUrl,
          isPublished: intend === 'Publish' ? true : false,
        },
        tickets: payload.createTicket.data,
      };
      const response = await apiclient.post('/events', dto);
      return response.data;
    },
    onSuccess: () => {
      setShowConfetti(true);
      startTransition(() => {
        setStorageToDefault();
        refetchNow(['my-events', 'event-detail']);
        toast({
          title: `Success ${intend} Event`,
          description: `${intend === 'Publish' ? 'Your event has been published.' : 'Your event has been saved.'}`,
          variant: 'default',
        });
        if (payload.createEvent.data.id) {
          router.replace(
            `/members/details/${payload.createEvent.data.id}/summary`,
          );
        } else {
          router.replace('/members/my-events');
        }
      });
    },
    onError: (error: AxiosError) => {
      if (error.status === 422) {
        const {
          error: { detail: errmap },
        } = error.response?.data as { error: { detail: any } };

        let uploadBannerError = false;
        let createEventError = false;
        let createTicketError = false;

        if (errmap?.event?.bannerUrl) {
          updateBannerError(() => ({
            bannerUrl: {
              message: errmap.event.bannerUrl._errors,
              type: 'onChange',
            },
          }));
          delete errmap.event.bannerUrl;
          uploadBannerError = true;
        }

        if (errmap?.event) {
          updateCreateEventError(() => {
            const result: Record<string, any> = {};
            for (const key in errmap?.event) {
              if (key === '_errors' || key === 'id') continue;
              result[key] = {
                message: errmap.event[key]._errors,
                type: 'onChange',
              };
            }
            return result;
          });
          createEventError = true;
        }

        if (errmap?.tickets) {
          updateCreateTicketError(() => {
            const result: Record<string, any> = {};

            for (const key in errmap?.tickets) {
              if (key === '_errors') continue;

              for (const innerkey in errmap?.tickets[key]) {
                if (innerkey === '_errors' || innerkey === 'id') continue;

                result[key] = {
                  [innerkey]: {
                    message: errmap?.tickets[key][innerkey]._errors,
                    type: 'onChange',
                  },
                };
              }
            }

            return result;
          });
          createTicketError = true;
        }

        if (uploadBannerError) {
          router.replace('/members/configure/upload-banner');
        } else if (createEventError) {
          router.replace('/members/configure/create-event');
        } else if (createTicketError) {
          router.replace('/members/configure/create-ticket');
        }
      } else {
        toast({
          title: 'Internal Server Error',
          description: 'Oops we found some issue, please try again later',
          variant: 'destructive',
        });
      }
    },
  });

  if (currentPath !== 'review-draft') {
    return <div></div>;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="flex pointer-events-none select-none justify-center absolute inset-0 overflow-hidden z-50"
      >
        <Confetti
          active={showConfetti}
          config={{
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 70,
            dragFriction: 0.12,
            duration: 4000,
            stagger: 3,
            width: '10px',
            height: '10px',
            perspective: '500px',
            colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br bg-white grainy-light">
        <div className="relative">
          {/* Blur effect background */}
          <div className="absolute inset-0 border backdrop-blur-xl" />

          <MaxWidthWrapper className="relative">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3  max-md:hidden">
                <PartyPopper className="h-6 w-6 text-brand-rose-500" />
                <div>
                  <span className="text-xl font-semibold text-brand-blue-950">
                    Yeay!
                  </span>
                  <span className="ml-2 text-brand-blue-800">
                    Just one more click and your event will be published.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 max-md:w-full max-md:justify-center">
                <Button
                  className="flex items-center gap-2 bg-white/80 text-brand-blue-950 hover:bg-brand-blue-50 border border-brand-blue-100"
                  disabled={isPending || isRedirecting}
                  onClick={() => {
                    setIntend('Save');
                    publish('Save');
                  }}
                >
                  {isPending && intend === 'Save' ? (
                    <>
                      <Spinner />
                      Saving...
                    </>
                  ) : isRedirecting && intend === 'Save' ? (
                    <>
                      <RotateCw className="size-4" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save as Draft
                    </>
                  )}
                </Button>
                <Button
                  className="flex items-center gap-2 bg-brand-rose-600 text-white hover:bg-brand-rose-600/90 font-medium"
                  onClick={() => {
                    setIntend('Publish');
                    publish('Publish');
                  }}
                  disabled={isPending || isRedirecting}
                >
                  {isPending && intend === 'Publish' ? (
                    <>
                      <Spinner />
                      Publishing...
                    </>
                  ) : isRedirecting && intend === 'Publish' ? (
                    <>
                      <RotateCw className="size-4" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Award className="size-4" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </>
  );
}
