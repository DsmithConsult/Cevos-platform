namespace Cevos.Api;

public class RangeCalculator
{
    public double CalculateRange(double batteryKwh, double efficiency)
    {
        return batteryKwh * efficiency;
    }
}
