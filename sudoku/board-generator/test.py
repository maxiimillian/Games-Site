from typing import NamedTuple

class SudokuBoard(NamedTuple):
    unsolved: str 
    solved: str 

boards = []

f = open("test.txt", "r")

test = f.read().split("\n,")

iter = iter(test)

print(test)


for puzzle in iter:
    print(puzzle, next(iter))

