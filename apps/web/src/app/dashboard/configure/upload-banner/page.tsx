'use client';

import ButtonRose from '@/components/shared/button-rose';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useCreateEventContext } from '@/context/create-event-provider';
import { useRender } from '@/hooks/use-rendered';
import { toast } from '@/hooks/use-toast';
import { apiclient } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  ChevronRightIcon,
  CirclePlus,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { UploadBannerSchema } from './validation';

type FormData = z.infer<typeof UploadBannerSchema>;

export default function UploadBannerStep() {
  const { isRendered } = useRender();
  const { payload, updateBannerError, updateBannerPayload } =
    useCreateEventContext();
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(UploadBannerSchema),
    defaultValues: {
      bannerUrl: payload.uploadBanner.data?.bannerUrl,
    },
    errors: payload.uploadBanner.error,
  });

  const { isPending, mutate: upload } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file-upload', file);
      const response = await apiclient.post('/events/upload-banner', formData, {
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
      form.setValue('bannerUrl', data.imageUrl);
      updateBannerPayload(() => ({
        bannerUrl: data.imageUrl,
      }));
      form.clearErrors();
      updateBannerError(() => undefined);
      toast({
        title: 'Success!',
        description: 'Your banner has been uploaded successfully.',
      });
    },
    onError: (err) => {
      console.log({ err });
      toast({
        title: 'Upload Failed',
        description:
          'There was an error uploading your banner. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        upload(acceptedFiles[0]);
      }
    },
    [upload],
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
  });

  const handleRemove = () => {
    form.setValue('bannerUrl', '');
    updateBannerPayload((prev) => {
      prev.bannerUrl = '';
      return prev;
    });
    setUploadProgress(0);
  };

  const onSubmit = (data: FormData) => {
    router.push('/dashboard/configure/create-event');
  };

  if (!isRendered) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-4xl shadow-lg">
          <CardHeader className="space-y-4 border-b bg-white px-8 py-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-brand-rose-500" />
              <CardTitle className="text-2xl font-bold text-gray-800">
                Create Your Event Banner
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Make your event stand out with a captivating banner. Choose an
              image that best represents your event's spirit and purpose.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 bg-white px-8 py-6">
            <FormField
              control={form.control}
              name="bannerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`
                        relative flex aspect-video cursor-pointer flex-col
                        items-center justify-center overflow-hidden rounded-lg
                        border-2 border-dashed transition-all duration-300
                        ${isDragActive ? 'border-brand-rose-400 bg-brand-rose-50' : 'border-gray-200 hover:border-brand-rose-300'}
                      `}
                    >
                      <input {...getInputProps()} className="sr-only" />

                      {!field.value && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center size-full">
                            <div className="relative size-full">
                              <Image
                                src="/banner-event-placeholder.jpg"
                                alt="Banner placeholder"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 size-full bg-black/40 backdrop-blur-[2px]" />
                            </div>
                          </div>
                          {!isDragActive && !isPending && (
                            <div className="absolute inset-0 flex items-center justify-center size-full">
                              <div className="text-center text-white">
                                <CirclePlus className="mx-auto h-14 w-14 animate-pulse text-brand-rose-400 max-sm:size-8" />
                                <p className="mt-4 text-lg font-medium max-sm:text-xs">
                                  Drop your banner here or click to upload
                                </p>
                                <p className="mt-2 text-sm text-brand-white-100 max-sm:hidden">
                                  Supports PNG, JPG or JPEG (max. 5MB)
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {isDragActive && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-brand-rose-50/95">
                          <Upload className="h-16 w-16 text-brand-rose-500 max-sm:size-8" />
                          <p className="mt-4 text-lg font-medium text-brand-rose-500 max-sm:text-sm">
                            Drop to upload your banner
                          </p>
                        </div>
                      )}

                      {isPending && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95">
                          <Loader2 className="h-10 w-10 animate-spin text-brand-rose-500" />
                          <p className="mt-4 text-lg font-medium text-gray-800 max-sm:text-sm">
                            Uploading your banner...
                          </p>
                          <div className="mt-4 w-64 max-sm:hidden">
                            <Progress
                              value={uploadProgress}
                              className="h-2 bg-brand-rose-100"
                              indicatorClassName="bg-brand-rose-500"
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
                            alt="Uploaded banner"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                            <div className="z-10 text-center text-white">
                              <p className="mb-4 text-lg font-medium max-sm:hidden">
                                Click or drag to replace
                              </p>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-brand-rose-500 hover:bg-brand-rose-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove();
                                }}
                                type="button"
                              >
                                <X className="mr-2 h-4 w-4 max-sm:m-0" />
                                <span className="max-sm:hidden">
                                  Remove Banner
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 text-center text-sm text-gray-500">
              {form.watch('bannerUrl') ? (
                <p>
                  Your banner is ready! Click or drag a new image to replace it.
                </p>
              ) : (
                <p>
                  Recommended size: 1920x1080px (16:9 ratio) for best display
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <ButtonRose
                type="submit"
                isLink={false}
                iconPosition="right"
                label="Continue"
                icon={<ChevronRightIcon className="size-5" />}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
