import { LEARNING_TIPS, QUIZ_QUESTIONS } from "../data/aprendizaje"
import { normalizeKeyword, pickRandom } from "../parse"
import type { CommandMap, TerminalContext } from "./types"

/** Filtra por tema; `null` si el comando ya respondió. */
function filterByTopic<T extends { topic: string }>(
  ctx: TerminalContext,
  items: readonly T[]
): T[] | null {
  const requested = normalizeKeyword(ctx.args)
  const topics = [...new Set(items.map(({ topic }) => topic))]

  if (requested === "temas" || requested === "topics") {
    ctx.print([`temas disponibles: ${topics.join(", ")}`])
    return null
  }

  const matches = requested
    ? items.filter(({ topic }) => normalizeKeyword(topic) === requested)
    : [...items]

  if (matches.length === 0) {
    ctx.fail([
      `tema desconocido: ${ctx.args}`,
      `disponibles: ${topics.join(", ")}`
    ])
    return null
  }

  return matches
}

/** Comandos de estudio. */
export const aprendizajeCommands: CommandMap = {
  quiz: {
    description: "iniciar una pregunta técnica interactiva",
    args: true,
    run: (ctx) => {
      const candidates = filterByTopic(ctx, QUIZ_QUESTIONS)
      if (!candidates) return

      // No repetir la pregunta activa.
      const alternatives =
        ctx.quiz && candidates.length > 1
          ? candidates.filter((question) => question !== ctx.quiz)
          : candidates

      const question = pickRandom(alternatives)
      ctx.setQuiz(question)
      ctx.print([
        `quiz · ${question.topic}`,
        question.question,
        ...question.choices.map((choice, index) => `${index + 1}. ${choice}`),
        "responde con /respuesta <número> · /respuesta ver revela la solución"
      ])
    }
  },

  respuesta: {
    description: "responder la pregunta activa",
    args: true,
    aliases: ["answer"],
    run: (ctx) => {
      const quiz = ctx.quiz
      if (!quiz) {
        ctx.fail(["no hay una pregunta activa; ejecuta /quiz o /quiz temas"])
        return
      }

      const correct = quiz.choices[quiz.answer]
      if (["ver", "rendirse", "skip"].includes(normalizeKeyword(ctx.args))) {
        ctx.print([
          `respuesta: ${quiz.answer + 1}. ${correct}`,
          quiz.explanation
        ])
        ctx.setQuiz(null)
        return
      }

      const chosen = Number.parseInt(ctx.args, 10) - 1
      if (
        !/^\d+$/.test(ctx.args) ||
        chosen < 0 ||
        chosen >= quiz.choices.length
      ) {
        ctx.fail(["uso: /respuesta <número> o /respuesta ver"])
        return
      }

      if (chosen === quiz.answer) {
        ctx.print(["✓ respuesta correcta", quiz.explanation], "success")
        ctx.setQuiz(null)
        return
      }

      ctx.fail([
        `✗ “${quiz.choices[chosen]}” no es la respuesta`,
        "inténtalo otra vez o usa /respuesta ver para estudiar la explicación"
      ])
    }
  },

  tip: {
    description: "mostrar un consejo técnico por tema",
    args: true,
    run: (ctx) => {
      const candidates = filterByTopic(ctx, LEARNING_TIPS)
      if (!candidates) return

      const tip = pickRandom(candidates)
      ctx.print([`tip · ${tip.topic}`, tip.text], "success")
    }
  }
}
