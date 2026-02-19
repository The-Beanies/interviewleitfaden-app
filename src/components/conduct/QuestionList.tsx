import type { InterviewQuestion } from '@/types'

export function QuestionList({ questions }: { questions: InterviewQuestion[] }) {
  return (
    <ul className="space-y-2 text-base text-carbon-black/85">
      {questions.map((question) => (
        <li key={question.id} className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
          <p>{question.text}</p>
        </li>
      ))}
    </ul>
  )
}
