import React from 'react';
import { Button } from '../Button';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Dice1, HelpCircle, Star, Users, Target } from 'lucide-react';

export function HowToPlayScreen() {
  const { setScreen } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              ¿Cómo se juega?
            </h1>
            <p className="text-lg text-gray-600">¡Es muy fácil y divertido!</p>
          </div>

          {/* Instructions */}
          <div className="space-y-6 mb-8">
            {/* Step 1 */}
            <div className="flex gap-4 items-start bg-blue-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-blue-900">1. Crea tu personaje</h3>
                <p className="text-gray-700">Elige tu avatar favorito y escribe tu nombre. Pueden jugar de 2 a 6 personas.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start bg-purple-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Dice1 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-purple-900">2. Lanza el dado</h3>
                <p className="text-gray-700">En tu turno, lanza el dado y avanza el número de casillas que salga. Si sacas 6, ¡lanzas de nuevo!</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start bg-green-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-green-900">3. Responde preguntas</h3>
                <p className="text-gray-700">Responde preguntas sobre inclusión y respeto. ¡Si aciertas, avanzas más!</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 items-start bg-yellow-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-yellow-900">4. Casillas especiales</h3>
                <p className="text-gray-700">
                  <strong>🎓 Acción Docente:</strong> Avanza más espacios<br />
                  <strong>🚧 Barrera:</strong> Retrocede<br />
                  <strong>⭐ Recompensa:</strong> ¡Bonus especial!
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 items-start bg-pink-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2 text-pink-900">5. ¡Llega a la meta!</h3>
                <p className="text-gray-700">El primer jugador que llegue a la casilla 30 gana. ¡Aprende y diviértete!</p>
              </div>
            </div>
          </div>

          {/* Fun fact */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8 text-center">
            <p className="text-lg text-gray-800">
              💡 <strong>Recuerda:</strong> La inclusión nos hace más fuertes y mejores personas.
              ¡Cada pregunta te enseña algo valioso!
            </p>
          </div>

          {/* Back button */}
          <div className="text-center">
            <Button
              onClick={() => setScreen('home')}
              variant="primary"
              size="lg"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
