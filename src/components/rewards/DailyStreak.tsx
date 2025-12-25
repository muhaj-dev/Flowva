import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import { Card, CardHeader, CardBody, Button } from '../ui';

interface DailyStreakProps {
  streak: number;
  canCheckIn: boolean;
  onCheckIn: () => void;
  loading?: boolean;
}

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const DailyStreak: React.FC<DailyStreakProps> = ({
  streak,
  canCheckIn,
  onCheckIn,
  loading = false,
}) => {
  return (
    <Card className="bg-white" noPadding>
      <CardHeader colored>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <Calendar className="h-5 w-5 text-[var(--color-secondary)]" />
          Daily Streak
        </h3>
      </CardHeader>
      <CardBody>
        <div className="font-extrabold text-4xl text-[var(--color-primary)] mb-2">
          {streak} day{streak !== 1 ? 's' : ''}
        </div>

        {/* Week Indicators */}
        <div className="flex mt-4 space-x-2 justify-center">
          {daysOfWeek.map((day, index) => {
            const isActive = index < streak % 7 || (streak >= 7 && index < 7);
            const isToday = index === (streak - 1) % 7 && streak > 0;

            return (
              <div
                key={index}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  isToday
                    ? 'bg-gray-200 text-gray-500 ring-2 ring-[#9013fe] ring-offset-2'
                    : isActive
                    ? 'bg-[#70D6FF] border-4 border-cyan-200 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Check in daily to to earn +5 points
        </p>

        <Button
          variant={canCheckIn ? 'primary' : 'disabled'}
          size="md"
          className="mt-4 w-full text-[15px]"
          onClick={onCheckIn}
          disabled={!canCheckIn || loading}
          icon={Zap}
        >
          {loading ? 'Checking in...' : canCheckIn ? "Claim Today's Points" : 'Claimed Today'}
        </Button>
      </CardBody>
    </Card>
  );
};
