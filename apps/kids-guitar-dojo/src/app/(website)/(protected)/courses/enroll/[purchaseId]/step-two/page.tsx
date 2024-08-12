'use client';
import { DialogLayout } from '@rocket-house-productions/lesson';
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rocket-house-productions/shadcn-ui';
import { BASE_URL, FormErrors } from '../_component/path-types';
import { useFormState } from 'react-dom';
import stepTwoFormAction from './action';
import { useForm } from 'react-hook-form';
import { stepTwoSchema } from '../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import z from 'zod';
import { PrevButton } from '../_component/button-prev';
import { CalendarIcon, XIcon } from 'lucide-react';
import cn from 'classnames';
import { format } from 'date-fns';

const initialState: FormErrors = {};

export default function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  const [serverError, formAction] = useFormState(stepTwoFormAction, initialState);

  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      birthday: '',
      gender: undefined,
      productId: params.purchaseId,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title="🎸 Hey Kids, This Part's for You! 🎸">
      Fill in your details, and get ready for some musical fun! 🎶 We’ll only use your info to create a fun profile
      name—never shared with anyone else.
      <div className={'flex-1 text-left'}>
        <Form {...(form as any)}>
          {serverError && Object.keys(serverError).length !== 0 && serverError?.issues && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    There were {Object.keys(serverError).length + 1} errors with your submission
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul role="list" className="list-disc space-y-1 pl-5">
                      {Object.keys(serverError).map(issue => (
                        <li key={issue} className="flex gap-1">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <form
            ref={formRef}
            className="space-y-4"
            action={formAction}
            onSubmit={evt => {
              evt.preventDefault();
              form.handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(evt);
            }}>
            <div className="relative pt-5">
              <div className={'grid grid-cols-1 gap-x-3 md:grid-cols-2'}>
                <FormField
                  control={form.control as any}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className={'space-y-0'}>
                      <FormLabel className={'mr-2'}>Birthday </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-[240px] pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer not to say">Prefer not to say</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={'my-5 space-y-3'}>
                <FormField
                  control={form.control as any}
                  name="favoriteAnimal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Animal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your favorite animal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="fish">Fish</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="hamster">Hamster</SelectItem>
                          <SelectItem value="turtle">Turtle</SelectItem>
                          <SelectItem value="lizard">Lizard</SelectItem>
                          <SelectItem value="snake">Snake</SelectItem>
                          <SelectItem value="horse">Horse</SelectItem>
                          <SelectItem value="guinea pig">Guinea Pig</SelectItem>
                          <SelectItem value="frog">Frog</SelectItem>
                          <SelectItem value="mouse">Mouse</SelectItem>
                          <SelectItem value="ferret">Ferret</SelectItem>
                          <SelectItem value="hedgehog">Hedgehog</SelectItem>
                          <SelectItem value="chinchilla">Chinchilla</SelectItem>
                          <SelectItem value="hermit crab">Hermit Crab</SelectItem>
                          <SelectItem value="parrot">Parrot</SelectItem>
                          <SelectItem value="gerbil">Gerbil</SelectItem>
                          <SelectItem value="goat">Goat</SelectItem>
                          <SelectItem value="alpaca">Alpaca</SelectItem>
                          <SelectItem value="iguana">Iguana</SelectItem>
                          <SelectItem value="gecko">Gecko</SelectItem>
                          <SelectItem value="tarantula">Tarantula</SelectItem>
                          <SelectItem value="scorpion">Scorpion</SelectItem>
                          <SelectItem value="pig">Pig</SelectItem>
                          <SelectItem value="cow">Cow</SelectItem>
                          <SelectItem value="duck">Duck</SelectItem>
                          <SelectItem value="chicken">Chicken</SelectItem>
                          <SelectItem value="peacock">Peacock</SelectItem>
                          <SelectItem value="pony">Pony</SelectItem>
                          <SelectItem value="lamb">Lamb</SelectItem>
                          <SelectItem value="raccoon">Raccoon</SelectItem>
                          <SelectItem value="fox">Fox</SelectItem>
                          <SelectItem value="owl">Owl</SelectItem>
                          <SelectItem value="penguin">Penguin</SelectItem>
                          <SelectItem value="koala">Koala</SelectItem>
                          <SelectItem value="kangaroo">Kangaroo</SelectItem>
                          <SelectItem value="sea turtle">Sea Turtle</SelectItem>
                          <SelectItem value="dolphin">Dolphin</SelectItem>
                          <SelectItem value="whale">Whale</SelectItem>
                          <SelectItem value="octopus">Octopus</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="favoriteSuperpower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Superpower</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your favorite superpower" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flying">Flying</SelectItem>
                          <SelectItem value="invisibility">Invisibility</SelectItem>
                          <SelectItem value="super_strength">Super Strength</SelectItem>
                          <SelectItem value="teleportation">Teleportation</SelectItem>
                          <SelectItem value="telekinesis">Telekinesis</SelectItem>
                          <SelectItem value="time_travel">Time Travel</SelectItem>
                          <SelectItem value="mind_reading">Mind Reading</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="favoriteHobby"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Hobby</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your favorite hobby" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="drawing">Drawing</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="dancing">Dancing</SelectItem>
                          <SelectItem value="cooking">Cooking</SelectItem>
                          <SelectItem value="video_games">Video Games</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={'mt-10 flex w-full shrink flex-row justify-between'}>
              <PrevButton baseUrl={baseUrl} />
              <Button type={'submit'} variant={'lesson'} size={'lg'}>
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogLayout>
  );
}
