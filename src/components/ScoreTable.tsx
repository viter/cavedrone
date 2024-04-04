import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Scores {
  data: Score[];
}

interface Score {
  name: string;
  level: number;
  score: number;
}

export default function ScoreTable() {
  const scoresString = localStorage.getItem('scores');
  let scores: Scores;
  if (scoresString) {
    scores = JSON.parse(scoresString);
    scores.data.sort((a, b) => b.score - a.score);
  }

  return (
    <div>
      <h1 className="text-2xl text-gray-700 text-center mt-10 mb-5">Score Board</h1>
      <div className="max-h-[400px] overflow-auto px-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-slate-700 text-base">Player's Name</TableHead>
              <TableHead className="text-slate-700 text-base">Level</TableHead>
              <TableHead className="text-right text-slate-700 text-base">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores ? (
              scores.data.map((score, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{score.name}</TableCell>
                  <TableCell>{score.level}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="font-medium">No scores yet</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
