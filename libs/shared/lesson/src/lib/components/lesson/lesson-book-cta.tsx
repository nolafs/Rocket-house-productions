interface LessonBookCtaProps {
  bookCta: boolean;
  bookMessage: string;
}

export function LessonBookCta({ bookCta, bookMessage }: LessonBookCtaProps) {
  if (bookCta) {
    return (
      <div className={''}>
        <h1>Welcome to LessonBookCta!</h1>
        <p>{bookMessage}</p>
      </div>
    );
  }

  return null;
}

export default LessonBookCta;
