from typing import List, Dict
from ortools.sat.python import cp_model

def run_stowage_cp(ship: Dict, cargos: List[Dict]):
    model = cp_model.CpModel()

    grid_x = int(ship["length"])
    grid_y = int(ship["height"])
    grid_z = int(ship["width"])

    x = {}
    y = {}
    z = {}
    used = {}

    for i, cargo in enumerate(cargos):
        max_x = grid_x - int(cargo["length"])
        max_y = grid_y - int(cargo["height"])
        max_z = grid_z - int(cargo["width"])

        x[i] = model.NewIntVar(0, max_x, f"x_{i}")
        y[i] = model.NewIntVar(0, max_y, f"y_{i}")
        z[i] = model.NewIntVar(0, max_z, f"z_{i}")
        used[i] = model.NewBoolVar(f"used_{i}")

    # Simple non-overlap: use no-overlap in each dimension with big-M; here a crude pairwise separation.
    M = max(grid_x, grid_y, grid_z) * 2
    for i in range(len(cargos)):
        for j in range(i + 1, len(cargos)):
            bi = cargos[i]
            bj = cargos[j]

            no_overlap = []
            no_overlap.append(model.NewBoolVar(f"i_before_j_x_{i}_{j}"))
            no_overlap.append(model.NewBoolVar(f"j_before_i_x_{i}_{j}"))
            no_overlap.append(model.NewBoolVar(f"i_below_j_y_{i}_{j}"))
            no_overlap.append(model.NewBoolVar(f"j_below_i_y_{i}_{j}"))
            no_overlap.append(model.NewBoolVar(f"i_before_j_z_{i}_{j}"))
            no_overlap.append(model.NewBoolVar(f"j_before_i_z_{i}_{j}"))

            model.Add(x[i] + int(bi["length"]) <= x[j] + M * (1 - no_overlap[0]))
            model.Add(x[j] + int(bj["length"]) <= x[i] + M * (1 - no_overlap[1]))
            model.Add(y[i] + int(bi["height"]) <= y[j] + M * (1 - no_overlap[2]))
            model.Add(y[j] + int(bj["height"]) <= y[i] + M * (1 - no_overlap[3]))
            model.Add(z[i] + int(bi["width"]) <= z[j] + M * (1 - no_overlap[4]))
            model.Add(z[j] + int(bj["width"]) <= z[i] + M * (1 - no_overlap[5]))

            model.AddBoolOr(no_overlap)

    # Objective: maximize number of used cargos (simple)
    model.Maximize(sum(used.values()))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    placements = []
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for i, cargo in enumerate(cargos):
            placements.append(
                {
                    "id": cargo["id"],
                    "x": float(solver.Value(x[i])),
                    "y": float(solver.Value(y[i])),
                    "z": float(solver.Value(z[i])),
                    "length": float(cargo["length"]),
                    "width": float(cargo["width"]),
                    "height": float(cargo["height"]),
                    "caution": cargo["caution"],
                }
            )

    utilization = len(placements) / len(cargos) if cargos else 0.0
    return placements, utilization
