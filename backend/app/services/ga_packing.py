# app/services/ga_packing.py
import random
from typing import List, Dict, Tuple

import numpy as np
from deap import base, creator, tools

from app.utils.geometry import check_overlap, fits_in_container, compute_volume

random.seed(42)

creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)


def create_individual(num_boxes: int):
    order = list(range(num_boxes))
    random.shuffle(order)
    orientations = [random.randint(0, 5) for _ in range(num_boxes)]
    return creator.Individual(list(zip(order, orientations)))


def decode_individual(individual, boxes: List[Dict], container: Dict) -> Tuple[List[Dict], float]:
    placements: List[Dict] = []
    used_volume = 0.0

    orientation_matrices = [
        lambda b: (b["length"], b["width"], b["height"]),
        lambda b: (b["length"], b["height"], b["width"]),
        lambda b: (b["width"], b["length"], b["height"]),
        lambda b: (b["width"], b["height"], b["length"]),
        lambda b: (b["height"], b["length"], b["width"]),
        lambda b: (b["height"], b["width"], b["length"]),
    ]

    for idx, ori_idx in individual:
        b = boxes[idx]
        l, w, h = orientation_matrices[ori_idx % 6](b)

        placed = False
        for x in np.arange(0, container["length"], 1.0):
            if placed:
                break
            for y in np.arange(0, container["height"], 1.0):
                if placed:
                    break
                for z in np.arange(0, container["width"], 1.0):
                    candidate = {
                        "id": b["id"],
                        "length": l,
                        "width": w,
                        "height": h,
                        "x": float(x),
                        "y": float(y),
                        "z": float(z),
                        "caution": b["caution"],
                    }
                    if not fits_in_container(candidate, container):
                        continue
                    if any(check_overlap(candidate, p) for p in placements):
                        continue
                    placements.append(candidate)
                    used_volume += compute_volume(l, w, h)
                    placed = True
                    break

    container_vol = compute_volume(
        container["length"], container["width"], container["height"]
    )
    utilization = used_volume / container_vol if container_vol > 0 else 0.0
    return placements, utilization


def eval_individual(individual, boxes: List[Dict], container: Dict):
    _, utilization = decode_individual(individual, boxes, container)
    return (utilization,)


def run_ga_packing(
    boxes: List[Dict],
    container: Dict,
    ngen: int = 40,
    pop_size: int = 50,
):
    num_boxes = len(boxes)

    # Handle small cases to avoid DEAP cxTwoPoint crash
    if num_boxes == 0:
        return [], 0.0

    if num_boxes == 1:
        b = boxes[0]
        placement = {
            "id": b["id"],
            "x": 0.0,
            "y": 0.0,
            "z": 0.0,
            "length": b["length"],
            "width": b["width"],
            "height": b["height"],
            "caution": b["caution"],
        }
        container_vol = compute_volume(
            container["length"], container["width"], container["height"]
        )
        used = compute_volume(b["length"], b["width"], b["height"])
        utilization = used / container_vol if container_vol > 0 else 0.0
        return [placement], utilization

    # GA for 2+ boxes
    toolbox = base.Toolbox()
    toolbox.register("individual", create_individual, num_boxes=num_boxes)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    toolbox.register("evaluate", eval_individual, boxes=boxes, container=container)
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutShuffleIndexes, indpb=0.1)
    toolbox.register("select", tools.selTournament, tournsize=3)

    pop = toolbox.population(n=pop_size)

    for _ in range(ngen):
        offspring = toolbox.select(pop, len(pop))
        offspring = list(map(toolbox.clone, offspring))

        for c1, c2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < 0.7:
                toolbox.mate(c1, c2)
                if hasattr(c1, "fitness"):
                    del c1.fitness.values
                if hasattr(c2, "fitness"):
                    del c2.fitness.values

        for mut in offspring:
            if random.random() < 0.2:
                toolbox.mutate(mut)
                if hasattr(mut, "fitness"):
                    del mut.fitness.values

        invalid = [ind for ind in offspring if not ind.fitness.valid]
        for ind in invalid:
            ind.fitness.values = toolbox.evaluate(ind)

        pop[:] = offspring

    best = tools.selBest(pop, 1)[0]
    placements, utilization = decode_individual(best, boxes, container)
    return placements, utilization
