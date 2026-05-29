import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question: '¿Qué significa respetar a los demás?',
    options: [
      'Ignorar a las personas diferentes',
      'Tratar a todos con amabilidad y consideración',
      'Solo hablar con mis amigos',
      'Excluir a quien no me cae bien'
    ],
    correctAnswer: 1,
    explanation: '¡Correcto! Respetar significa tratar a todos con amabilidad, sin importar sus diferencias.'
  },
  {
    id: 2,
    question: '¿Debemos excluir a alguien por su apariencia?',
    options: [
      'Sí, si se ve diferente',
      'No, todos merecen ser incluidos',
      'Depende de cómo se vista',
      'Solo si no me gusta'
    ],
    correctAnswer: 1,
    explanation: '¡Excelente! Nadie debe ser excluido por su apariencia. La inclusión es para todos.'
  },
  {
    id: 3,
    question: '¿Todas las personas tienen derecho a estudiar?',
    options: [
      'Solo algunas personas',
      'Sí, todas las personas',
      'Solo quien puede pagar',
      'Depende del país'
    ],
    correctAnswer: 1,
    explanation: '¡Muy bien! La educación es un derecho humano fundamental para todas las personas.'
  },
  {
    id: 4,
    question: '¿Es importante ayudar a compañeros con discapacidad?',
    options: [
      'No, no es mi responsabilidad',
      'Sí, debemos apoyarnos mutuamente',
      'Solo si me lo piden',
      'Depende del día'
    ],
    correctAnswer: 1,
    explanation: '¡Perfecto! Ayudar y apoyar a nuestros compañeros crea una comunidad más inclusiva.'
  },
  {
    id: 5,
    question: '¿Debemos burlarnos de alguien por su cultura?',
    options: [
      'Sí, si es muy diferente',
      'No, todas las culturas merecen respeto',
      'Solo en broma',
      'Depende de cuál sea'
    ],
    correctAnswer: 1,
    explanation: '¡Correcto! La diversidad cultural es riqueza. Todas las culturas merecen respeto.'
  },
  {
    id: 6,
    question: '¿Qué debemos hacer si vemos bullying?',
    options: [
      'Ignorarlo y seguir adelante',
      'Reportarlo y apoyar a la víctima',
      'Unirnos al grupo',
      'Grabar video y reírse'
    ],
    correctAnswer: 1,
    explanation: '¡Excelente! Es importante detener el bullying y apoyar a quien lo sufre.'
  },
  {
    id: 7,
    question: '¿Todos podemos ser amigos sin importar diferencias?',
    options: [
      'No, solo con personas iguales',
      'Sí, las diferencias nos enriquecen',
      'Solo con mi mismo grupo',
      'Depende del color de piel'
    ],
    correctAnswer: 1,
    explanation: '¡Muy bien! Las diferencias nos hacen únicos y pueden crear amistades maravillosas.'
  },
  {
    id: 8,
    question: '¿Qué significa la palabra "empatía"?',
    options: [
      'Sentir lástima por otros',
      'Ponerse en el lugar del otro',
      'Ignorar los sentimientos ajenos',
      'Pensar solo en uno mismo'
    ],
    correctAnswer: 1,
    explanation: '¡Correcto! Empatía es comprender y sentir lo que otros experimentan.'
  },
  {
    id: 9,
    question: '¿Es correcto discriminar por género?',
    options: [
      'Sí, algunos géneros son mejores',
      'No, todos los géneros son iguales',
      'Depende del trabajo',
      'Solo en deportes'
    ],
    correctAnswer: 1,
    explanation: '¡Perfecto! Todos los géneros tienen el mismo valor y merecen igualdad de oportunidades.'
  },
  {
    id: 10,
    question: '¿Qué hace una escuela inclusiva?',
    options: [
      'Acepta solo a estudiantes destacados',
      'Acoge y valora a todos los estudiantes',
      'Separa por nivel académico',
      'Tiene reglas muy estrictas'
    ],
    correctAnswer: 1,
    explanation: '¡Excelente! Una escuela inclusiva valora y respeta la diversidad de todos sus estudiantes.'
  },
  {
    id: 11,
    question: '¿Debemos aprender sobre otras culturas?',
    options: [
      'No, solo la propia importa',
      'Sí, nos ayuda a comprender mejor el mundo',
      'Solo si viajamos',
      'No es necesario'
    ],
    correctAnswer: 1,
    explanation: '¡Muy bien! Aprender sobre otras culturas nos hace más tolerantes y comprensivos.'
  },
  {
    id: 12,
    question: '¿Qué es la diversidad?',
    options: [
      'Que todos sean iguales',
      'La variedad de características entre personas',
      'Un problema social',
      'Algo que divide'
    ],
    correctAnswer: 1,
    explanation: '¡Correcto! La diversidad es la riqueza de diferencias que nos hace únicos.'
  },
  {
    id: 13,
    question: '¿Es importante la accesibilidad en las escuelas?',
    options: [
      'No, solo para algunos',
      'Sí, para que todos puedan estudiar',
      'Solo si hay presupuesto',
      'No es prioritario'
    ],
    correctAnswer: 1,
    explanation: '¡Perfecto! La accesibilidad garantiza que todos puedan acceder a la educación.'
  },
  {
    id: 14,
    question: '¿Debemos usar lenguaje inclusivo?',
    options: [
      'No, no importa cómo hablamos',
      'Sí, para no excluir a nadie',
      'Solo en clase',
      'Es innecesario'
    ],
    correctAnswer: 1,
    explanation: '¡Excelente! El lenguaje inclusivo ayuda a que todos se sientan valorados.'
  },
  {
    id: 15,
    question: '¿Qué significa igualdad de oportunidades?',
    options: [
      'Que solo algunos tengan opciones',
      'Que todos tengan las mismas posibilidades',
      'Que ganemos lo mismo',
      'No existe realmente'
    ],
    correctAnswer: 1,
    explanation: '¡Muy bien! Igualdad de oportunidades significa que todos podemos alcanzar nuestros sueños.'
  }
];

export function getRandomQuestion(): Question {
  return questions[Math.floor(Math.random() * questions.length)];
}
