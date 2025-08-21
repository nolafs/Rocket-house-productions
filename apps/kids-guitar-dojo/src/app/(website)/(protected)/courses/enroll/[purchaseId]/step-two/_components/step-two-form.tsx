'use client';
import { DialogLayout } from '@rocket-house-productions/lesson/server';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
} from '@rocket-house-productions/shadcn-ui';
import { FormErrors } from '../../_component/path-types';
import stepTwoFormAction from '../action';
import { useForm } from 'react-hook-form';
import { stepTwoSchema } from '../../_component/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useActionState } from 'react';
import z from 'zod';
import { PrevButton } from '../../_component/button-prev';
import { XIcon } from 'lucide-react';
import { useOnBoardingContext } from '../../_component/onBoardinglContext';
import ButtonSubmit from '../../_component/button-submit';
import { KeyTextField, RichTextField } from '@prismicio/types';
import { PrismicRichText } from '@prismicio/react';
import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';

const initialState: FormErrors = {};

export interface StepTwoFormProps {
  baseUrl: string;
  header?: KeyTextField | string | null | undefined;
  body?: RichTextField | string | null | undefined;
}

export default function StepTwoForm({ baseUrl, header, body }: StepTwoFormProps) {
  const [serverError, formAction] = useActionState(stepTwoFormAction, initialState);
  const { updateOnBoardingDetails, onBoardingData } = useOnBoardingContext();
  const setActive = useMenuActive(state => state.setActive);

  useEffect(() => {
    setActive(true);
  }, []);

  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      birthday: onBoardingData.birthday || '',
      gender: onBoardingData.gender || undefined,
      favoriteAnimal: onBoardingData?.favoriteAnimal || undefined,
      favoriteSuperpower: onBoardingData?.favoriteSuperpower || undefined,
      favoriteHobby: onBoardingData?.favoriteHobby || undefined,
      favoriteColor: onBoardingData?.favoriteColor || undefined,
      productId: baseUrl,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogLayout title={header || "🎸 Hey Kids, This Part's for You! 🎸"}>
      {body && <div className="body">{typeof body === 'string' ? body : <PrismicRichText field={body} />}</div>}
      <div className={'flex-1 text-left'}>
        <Form {...(form as any)}>
          {serverError && Object.keys(serverError).length !== 0 && (
            <div className="mt-5 rounded-md bg-red-50 p-4">
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
            onChange={e => {
              const formData = new FormData(formRef.current!);
              const formUpdate = Object.fromEntries(formData.entries());
              updateOnBoardingDetails({
                ...onBoardingData,
                ...formUpdate,
              });
            }}>
            <div className="relative pt-5">
              <div className={'grid grid-cols-1 gap-x-3 md:grid-cols-2'}>
                <FormField
                  control={form.control as any}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className={'space-y-2'}>
                      <FormLabel className={'mb-2 inline-block'}>Birthday </FormLabel>

                      <DatePicker
                        {...field}
                        name="birthday"
                        onChange={field.onChange}
                        selected={field.value}
                        selectionType={'year'}
                        placeholder={'Select your birthday'}
                      />

                      <input type="hidden" name={field.name} value={field.value || ''} />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        {...field}
                        onValueChange={e => {
                          field.onChange(e);
                        }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non_binary">Non-binary</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
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
                      <FormLabel className={'sr-only'}>Favorite Animal</FormLabel>
                      <Select
                        {...field}
                        onValueChange={e => {
                          field.onChange(e);
                        }}>
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
                      <FormLabel className={'sr-only'}>Favorite Superpower</FormLabel>
                      <Select
                        {...field}
                        onValueChange={e => {
                          field.onChange(e);
                        }}>
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
                      <FormLabel className={'sr-only'}>Favorite Hobby</FormLabel>
                      <Select
                        {...field}
                        onValueChange={e => {
                          field.onChange(e);
                        }}>
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

                <FormField
                  control={form.control as any}
                  name="favoriteColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={'sr-only'}>Favorite Color</FormLabel>
                      <Select
                        {...field}
                        onValueChange={e => {
                          field.onChange(e);
                        }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please select your favorite color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="yellow">Yellow</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="pink">Pink</SelectItem>
                          <SelectItem value="brown">Brown</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
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
              <ButtonSubmit text={'Next'} />
            </div>
          </form>
        </Form>
      </div>
    </DialogLayout>
  );
}
