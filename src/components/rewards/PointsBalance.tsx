import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui';

interface PointsBalanceProps {
  points: number;
  nextRewardThreshold?: number;
  nextRewardName?: string;
}

export const PointsBalance: React.FC<PointsBalanceProps> = ({
  points,
  nextRewardThreshold = 5000,
  nextRewardName = '$5 Gift Card',
}) => {
  const progress = (points / nextRewardThreshold) * 100;

  return (
    <Card className="bg-white" noPadding>
      <CardHeader colored>
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <Award className="h-5 w-5 text-[var(--color-primary)]" />
          Points Balance
        </h3>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="font-extrabold text-4xl text-[var(--color-primary)] my-2">
            {points}
          </div>
          {/* Coin Icon */}
          <div className="w-20 h-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="coin-gradient-1" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-50.07" y1="-91.04" x2="70.08" y2="67.8">
                  <stop offset="0%" stopColor="rgb(255,234,0)"></stop>
                  <stop offset="50%" stopColor="rgb(255,199,0)"></stop>
                  <stop offset="100%" stopColor="rgb(255,165,0)"></stop>
                </linearGradient>
                <linearGradient id="coin-gradient-2" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="-36.18" y1="-68.44" x2="52.76" y2="47.96">
                  <stop offset="0%" stopColor="rgb(255,233,0)"></stop>
                  <stop offset="50%" stopColor="rgb(255,199,0)"></stop>
                  <stop offset="100%" stopColor="rgb(255,166,0)"></stop>
                </linearGradient>
                <linearGradient id="coin-gradient-3" spreadMethod="pad" gradientUnits="userSpaceOnUse" x1="4" y1="-55" x2="4" y2="35.52">
                  <stop offset="0%" stopColor="rgb(255,173,0)"></stop>
                  <stop offset="50%" stopColor="rgb(255,143,0)"></stop>
                  <stop offset="100%" stopColor="rgb(255,113,0)"></stop>
                </linearGradient>
              </defs>
              <g transform="translate(237,247)">
                <path fill="rgb(255,159,0)" d="M2.875,93 C-1.5,93 2.875,93 2.875,93 C2.875,93 2.875,53 2.875,-7.051 C2.875,-67 2.875,-107 2.875,-107 C2.875,-107 -1.25,-107 2.875,-107 C60,-107 102.75,-58.25 102.75,-7.25 C102.75,45.5 59.5,93 2.875,93z"></path>
                <path fill="url(#coin-gradient-1)" d="M103,-7 C103,48.23 58.23,93 3,93 C-52.23,93 -97,48.23 -97,-7 C-97,-62.23 -52.23,-107 3,-107 C58.23,-107 103,-62.23 103,-7z"></path>
                <path fill="rgb(255,187,0)" d="M83,-7 C83,37.18 47.18,73 3,73 C-41.18,73 -77,37.18 -77,-7 C-77,-51.18 -41.18,-87 3,-87 C47.18,-87 83,-51.18 83,-7z"></path>
                <path fill="url(#coin-gradient-2)" d="M75.5,-7 C75.5,33.04 43.04,65.5 3,65.5 C-37.04,65.5 -69.5,33.04 -69.5,-7 C-69.5,-47.04 -37.04,-79.5 3,-79.5 C43.04,-79.5 75.5,-47.04 75.5,-7z"></path>
                <path fill="url(#coin-gradient-3)" d="M6.63,-53.02 L18.62,-28.73 C19.39,-27.16 20.89,-26.07 22.62,-25.82 L49.43,-21.93 C51.61,-21.61 52.47,-18.93 50.9,-17.4 L31.5,1.51 C30.25,2.73 29.68,4.49 29.97,6.21 L34.55,32.91 C34.92,35.08 32.65,36.74 30.7,35.71 L6.72,23.1 C5.17,22.29 3.33,22.29 1.78,23.1 L-22.2,35.71 C-24.15,36.74 -26.42,35.08 -26.05,32.91 L-21.47,6.21 C-21.18,4.49 -21.75,2.73 -23,1.51 L-42.4,-17.4 C-43.97,-18.93 -43.11,-21.61 -40.93,-21.93 L-14.12,-25.82 C-12.39,-26.07 -10.89,-27.16 -10.12,-28.73 L1.87,-53.02 C2.84,-54.99 5.66,-54.99 6.63,-53.02z"></path>
                <path fill="rgb(226,101,0)" d="M21.12,-26.23 C21.89,-24.66 23.39,-23.57 25.12,-23.32 L51.69,-19.46 C51.62,-20.63 50.77,-21.73 49.43,-21.93 L22.62,-25.82 C22.07,-25.9 21.56,-26.09 21.07,-26.33 L21.12,-26.23z"></path>
                <path fill="rgb(226,101,0)" d="M-23.55,35.41 L-18.97,8.71 C-18.68,6.99 -19.25,5.23 -20.5,4.01 L-22.77,1.8 C-21.7,3 -21.2,4.61 -21.47,6.21 L-26.05,32.91 C-26.34,34.58 -25.06,35.93 -23.57,36.01 C-23.58,35.81 -23.59,35.62 -23.55,35.41z"></path>
                <path fill="rgb(253,127,24)" d="M-38.43,-19.43 L-11.62,-23.32 C-9.89,-23.57 -8.39,-24.66 -7.62,-26.23 L4.37,-50.52 C4.93,-51.65 6.09,-52.11 7.16,-51.95 L6.63,-53.02 C5.66,-54.99 2.84,-54.99 1.87,-53.02 L-10.12,-28.73 C-10.89,-27.16 -12.39,-26.07 -14.12,-25.82 L-40.93,-21.93 C-43.11,-21.61 -43.97,-18.93 -42.4,-17.4 L-40.09,-15.15 C-41.36,-16.71 -40.5,-19.13 -38.43,-19.43z"></path>
              </g>
            </svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              Progress to <span className="font-medium">{nextRewardName}</span>
            </span>
            <span className="font-medium">
              {points}/{nextRewardThreshold}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-pink)] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {points < 100
              ? '🚀 Just getting started — keep earning points!'
              : progress >= 100
              ? '🎉 You can redeem a reward!'
              : `💪 Keep going! ${nextRewardThreshold - points} more points to go!`}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
