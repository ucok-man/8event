'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useAuthContext } from '@/context/auth-provider';
import { usePaymentNotifContext } from '@/context/payment-notif-provider';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CirclePlus, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import Confetti from 'react-dom-confetti';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadPaymentProofSchema } from './validation';

type FormData = z.infer<typeof UploadPaymentProofSchema>;

type Props = {};

export default function PaymentProof({}: Props) {
  const { apiclient } = useAuthContext();
  const { pendingTransaction, showsnap, hidesnap, updatePaymentNotif } =
    usePaymentNotifContext();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proof, setProof] = useState('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();

  useEffect(() => {
    if (pendingTransaction) showsnap();
    return () => hidesnap();
  }, [pendingTransaction]);

  const form = useForm<FormData>({
    resolver: zodResolver(UploadPaymentProofSchema),
    defaultValues: {
      paymentProof: proof,
    },
  });

  const {
    isPending: isUploading,
    mutate: uploadImage,
    error: uploadError,
  } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file-upload', file);
      const response = await apiclient.post('/media/users/payment', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          );
          setUploadProgress(percentCompleted);
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setProof(data.imageUrl);
      setUploadProgress(0);
      form.setValue('paymentProof', data.imageUrl);
      form.clearErrors();
    },
    onError: () => {
      toast({
        title: 'Upload Failed',
        description:
          'There was an error uploading your image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const {
    isPending: isRemoving,
    mutate: removeImage,
    error: removeError,
  } = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiclient.delete('/media', {
        data: {
          mediaUrl: url,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          );
          setUploadProgress(percentCompleted);
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setUploadProgress(0);
      form.setValue('paymentProof', '');
    },
    onError: () => {
      toast({
        title: 'Remove Failed',
        description:
          'There was an error removing your image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadImage(acceptedFiles[0]);
      }
    },
    [uploadImage],
  );

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    toast({
      title: 'File Rejected',
      description: rejectedFiles[0].errors[0].message,
      variant: 'destructive',
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAccepted,
    onDropRejected: onDropRejected,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: !!form.watch('paymentProof'),
  });

  const { mutate: submit, isPending } = useMutation({
    mutationFn: async (proof: string) => {
      return await apiclient.patch(
        `/transactions/id/${pendingTransaction?.id}/proof`,
        {
          paymentProof: proof,
        },
      );
    },

    onSuccess: () => {
      setShowConfetti(true);
      updatePaymentNotif();
      // refetchNow(['event-detail']); // this will not sync accros device
      toast({
        title: '🎉 Payment Successfully Processed',
        description: 'For more information check your email',
        variant: 'default',
      });
      startTransition(() => {
        router.push('/');
      });
    },

    onError: () => {
      toast({
        title: 'Submit Failed',
        description:
          'There was an error submiting your proof. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (!pendingTransaction?.isPayed) {
              toast({
                title: 'Unprocessable Request',
                description: 'pay your bill first before submiting your proof',
                variant: 'destructive',
              });
              return;
            }
            submit(data.paymentProof);
          })}
          className="w-full md:h-[560px] overflow-hidden flex flex-col"
        >
          <FormField
            control={form.control}
            name="paymentProof"
            render={({ field }) => (
              <FormItem className="w-[320px] mx-auto h-[320px] md:size-full relative ">
                <FormControl>
                  <div
                    {...getRootProps()}
                    className={`
                relative flex size-full cursor-pointer flex-col
                items-center justify-center overflow-hidden rounded-lg
                border-2 border-dashed transition-all duration-300
                ${isDragActive ? 'border-brand-blue-400 bg-brand-blue-50' : 'border-gray-200 hover:border-brand-blue-300'}
              `}
                  >
                    <input {...getInputProps()} className="sr-only" />

                    {!field.value && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center size-full">
                          <div className="relative size-full">
                            <Image
                              src="/banner-event-placeholder.jpg"
                              alt="Image placeholder"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 size-full bg-black/40 backdrop-blur-[2px]" />
                          </div>
                        </div>
                        {!isDragActive && !isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center size-full">
                            <div className="text-center text-white">
                              <CirclePlus className="mx-auto size-14 animate-pulse text-brand-blue-400 max-md:size-12" />
                              <p className="mt-4 text-lg font-medium max-md:text-sm">
                                Drop your image here or click to upload
                              </p>
                              <p className="mt-2 text-sm text-brand-white-100 max-md:text-sm">
                                Supports PNG, JPG or JPEG (max. 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {isDragActive && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-brand-blue-50/95">
                        <Upload className="h-16 w-16 text-brand-blue-500 max-sm:size-8" />
                        <p className="mt-4 text-lg font-medium text-brand-blue-500 max-sm:text-sm">
                          Drop to upload your image
                        </p>
                      </div>
                    )}

                    {(isUploading || isRemoving) && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95">
                        <Loader2 className="h-10 w-10 animate-spin text-brand-blue-500" />
                        <p className="mt-4 text-lg font-medium text-gray-800 max-sm:text-sm">
                          {isUploading
                            ? 'Uploading your image...'
                            : 'Removing your image...'}
                        </p>
                        <div className="mt-4 w-64 max-sm:hidden">
                          <Progress
                            value={uploadProgress}
                            className="h-2 bg-brand-blue-100"
                            indicatorClassName="bg-brand-blue-500"
                          />
                          <p className="mt-2 text-center text-sm text-gray-500">
                            {uploadProgress}% complete
                          </p>
                        </div>
                      </div>
                    )}

                    {field.value && (
                      <div className="absolute inset-0">
                        <Image
                          src={field.value}
                          alt="Uploaded Image"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                          <div className="z-10 text-center text-white">
                            <p className="mb-4 text-lg font-medium max-sm:hidden">
                              Click remove first to replace it
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-brand-blue-500 hover:bg-brand-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(proof);
                              }}
                              type="button"
                            >
                              <X className="mr-2 h-4 w-4 max-sm:m-0" />
                              <span className="max-sm:hidden">
                                Remove Image
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <div className="absolute z-20 bottom-[60px]  w-full text-center">
                  <FormMessage className=" max-w-[250px] mx-auto md:max-w-none" />
                </div>
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="h-[38px] w-[320px] mx-auto md:w-full bg-brand-blue-700 text-center font-medium rounded-md shadow-sm text-white"
          >
            {isPending ? (
              <div className="flex w-full justify-center items-center">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submiting...
              </div>
            ) : isRedirecting ? (
              <div className="flex w-full justify-center items-center">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Redirecting...
              </div>
            ) : (
              'Submit My Proof'
            )}
          </button>
        </form>
      </Form>
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
            // perspective: '500px',
            colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
          }}
        />
      </div>
    </>
  );
}
