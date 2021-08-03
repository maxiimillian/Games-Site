from typing import NamedTuple
import sys 
import sqlite3 

conn = sqlite3.connect("src/db.db")
c = conn.cursor()

class SudokuBoard(NamedTuple):
    unsolved: str 
    solved: str 

boards = []

f = open("test.txt", "r")

test = f.read().split(",")


for puzzle in test:
    print(len(puzzle))
    unsolved = puzzle[0:82].replace("\n", "")
    solved = puzzle[82:].replace("\n", "")
    print(f"SOLVED : {solved}\n UNSOLVED: {unsolved}\n")
    print(f"{len(unsolved)} {len(solved)}")
    if len(puzzle) == 164:
        c.execute("INSERT INTO sudoku (solved, unsolved) VALUES (?,?)", (solved, unsolved))

conn.commit()
