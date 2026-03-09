---
publish: true
title: Neural Networks 101
description: A beginner-friendly introduction to neural networks — perceptrons, layers, activation functions, and training loops.
tags:
  - ml
  - neural-networks
  - learning
created: 2026-03-01
updated: 2026-03-08
---

# Neural Networks 101

A beginner-friendly guide to understanding neural networks from the ground up.

## What Is a Neural Network?

A neural network is a computational model inspired by the human brain. At its core, it's a function that maps inputs to outputs through layers of connected neurons.

```
Input → [Hidden Layer 1] → [Hidden Layer 2] → Output
```

## The Perceptron

The simplest neural network — a single neuron:

```python
import numpy as np

def perceptron(x, weights, bias):
    z = np.dot(x, weights) + bias
    return 1 if z > 0 else 0
```

## Activation Functions

| Function | Formula | Use Case |
|---|---|---|
| ReLU | `max(0, x)` | Hidden layers (default) |
| Sigmoid | `1 / (1 + e^-x)` | Binary classification |
| Softmax | `e^xi / Σe^xj` | Multi-class output |

## Building with Keras

```python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
```

## Key Concepts

- **Epoch**: One complete pass through the training dataset
- **Batch size**: Number of samples processed before updating weights
- **Learning rate**: Step size for gradient descent (typically 0.001)
- **Loss function**: Measures how wrong the model's predictions are
- **Backpropagation**: The algorithm that computes gradients layer by layer

See also [[Engineering/design-tokens]] for how structuring systems in layers applies beyond ML.
