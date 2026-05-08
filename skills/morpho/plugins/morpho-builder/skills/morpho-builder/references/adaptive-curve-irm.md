# AdaptiveCurveIRM

## Background

Morpho is IRM-agnostic — any interest rate model can be used if approved by governance. Currently, **AdaptiveCurveIRM** is the only approved model. It targets 90% utilization and uses two complementary mechanisms to adjust rates.

## Mechanism 1: Curve (Instantaneous)

The curve defines the relationship between utilization and interest rate at any given moment. It centers on a target rate `r₉₀%` at 90% utilization.

- **Below 90% utilization**: Rates scale down proportionally. Moving from 90% to 0% utilization divides the rate by 4.
- **Above 90% utilization**: Rates scale up steeply. Moving from 90% to 100% utilization multiplies the rate by 4.

This creates an asymmetric curve — rates rise much faster above the target than they fall below it, which strongly incentivizes utilization to stay near 90%.

## Mechanism 2: Adaptive (Continuous Shifting)

The adaptive mechanism shifts the entire curve up or down over time based on sustained utilization:

- **Utilization > 90%**: The target rate `r₉₀%` continuously increases, making borrowing progressively more expensive and incentivizing repayment
- **Utilization < 90%**: The target rate `r₉₀%` continuously decreases, making borrowing cheaper and incentivizing new loans
- **Utilization = 90%**: The target rate remains constant

The speed of adjustment correlates with distance from target:

| Utilization | Rate behavior | Speed |
|-------------|---------------|-------|
| 0% | Rate halves | Every ~5 days |
| 50% | Rate slowly decreases | Gradual |
| 90% (target) | Rate stable | No change |
| 95% | Rate slowly increases | Gradual |
| 100% | Rate doubles | Every ~5 days |

## APY Calculation

**Borrow APY** (from the per-second borrow rate):

```
borrowAPY = e^(borrowRate × 31_536_000) - 1
```

**Supply APY** (what lenders actually earn):

```
supplyAPY = borrowAPY × utilization × (1 - fee)
```

Where `fee` is the protocol fee (currently 0 on most markets). Supply APY is always less than borrow APY because not all supplied capital is borrowed.

## Starting Conditions

A newly created market with AdaptiveCurveIRM starts at:
- **4% APR** at 90% utilization
- Actual starting utilization is typically 0% (empty market)

Since the market starts at 0% utilization, the adaptive mechanism immediately begins halving the rate every ~5 days. This means:

- After 5 days at 0% utilization: rate ≈ 2% APR
- After 10 days: rate ≈ 1% APR
- After 20 days: rate ≈ 0.25% APR

## Operational Guidance

### Seed markets immediately

An empty market at 0% utilization triggers automatic rate decay. If the rate drops too low before real activity begins, it becomes unattractive to lenders, creating a chicken-and-egg problem. Provide initial supply and arrange initial borrowing shortly after creation.

### Avoid sustained 100% utilization

At 100% utilization, rates double every ~5 days. This compounds:
- Day 0: 4% APR
- Day 5: 8% APR
- Day 10: 16% APR
- Day 15: 32% APR

This can make positions rapidly uneconomical. If utilization hits 100%, it means all supplied capital is borrowed and new withdrawals are blocked until borrowers repay.

### Setting a target rate

To increase rates: push utilization above 90% (supply less or borrow more). The curve instantly jumps, and the adaptive mechanism begins shifting upward.

To decrease rates: push utilization below 90% (supply more or repay borrows). The curve instantly drops, and the adaptive mechanism begins shifting downward.

The adaptive mechanism is slow by design — plan rate adjustments well in advance.

### Monitoring

Key metrics to track:
- **Current utilization**: `market.state.utilization` via GraphQL or on-chain
- **Current borrow rate**: `market.state.borrowApy` via GraphQL
- **Rate trend**: Compare rates over time to detect if the adaptive mechanism is shifting up or down
