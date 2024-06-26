'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import FileUpload from '../file-upload';
import { useToast } from '../ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';

// regex to check if string only contains numbers
const regexp = /^\d+$/;

const formSchema = z.object({
  title: z.string(),
  date: z.date(),
  local: z.string(),
  additionalHours: z.string().regex(regexp),
  speakerRegistration: z.string().regex(regexp),
  organizerRegistration: z.string().regex(regexp),
  file: z.any()
});

type FileFormValues = z.infer<typeof formSchema>;

interface UploadFormProps {}

export const postEventParticipants = async (data: FileFormValues) => {
  const formData = new FormData();

  formData.append('Titulo', data.title);
  formData.append('Data', format(data.date, 'MM/dd/yyyy'));
  formData.append('Local', data.local);
  formData.append('HorasComplementares', data.additionalHours.toString());
  formData.append('MatriculaPalestrante', data.speakerRegistration.toString());
  formData.append(
    'MatriculaOrganizador',
    data.organizerRegistration.toString()
  );
  formData.append('file', data.file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/Evento/SalvaPresencaEvento`,
    {
      method: 'POST',
      cache: 'no-cache',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Um erro ocorreu durante a criação do usuário.');
  }

  return response;
};

export const UploadForm: React.FC<UploadFormProps> = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const action = 'Criar';

  const form = useForm<FileFormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FileFormValues) => {
    try {
      setLoading(true);
      const response = await postEventParticipants(data);

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Evento salvo!'
        });
        router.refresh();
        router.push(`/dashboard`);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description: 'Houve um problema com sua solicitação.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do evento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mt-auto flex flex-col">
                  <FormLabel>Data do evento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Universidade Federal Fluminense"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas complementares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speakerRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula do palestrante</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="1234"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizerRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula do organizador</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="1234"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value || []}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
