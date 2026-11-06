using Cevos.Api.Models;

namespace Cevos.Api.Data;

public sealed class InMemoryProjectRepository : IProjectRepository
{
    private readonly object _sync = new();
    private readonly Dictionary<int, Project> _projects = new();
    private int _nextId;

    public Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        lock (_sync)
        {
            IReadOnlyList<Project> result = _projects.Values
                .OrderByDescending(project => project.UpdatedAt)
                .Select(Clone)
                .ToArray();
            return Task.FromResult(result);
        }
    }

    public Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        lock (_sync)
        {
            return Task.FromResult(_projects.TryGetValue(id, out var project) ? Clone(project) : null);
        }
    }

    public Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);
        cancellationToken.ThrowIfCancellationRequested();

        lock (_sync)
        {
            var now = DateTimeOffset.UtcNow;
            var created = Clone(project);
            created.Id = ++_nextId;
            created.CreatedAt = now;
            created.UpdatedAt = now;
            _projects.Add(created.Id, created);
            return Task.FromResult(Clone(created));
        }
    }

    public Task<Project?> UpdateAsync(int id, Project project, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);
        cancellationToken.ThrowIfCancellationRequested();

        lock (_sync)
        {
            if (!_projects.TryGetValue(id, out var existing))
            {
                return Task.FromResult<Project?>(null);
            }

            var updated = Clone(project);
            updated.Id = id;
            updated.CreatedAt = existing.CreatedAt;
            updated.UpdatedAt = DateTimeOffset.UtcNow;
            _projects[id] = updated;
            return Task.FromResult<Project?>(Clone(updated));
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        lock (_sync)
        {
            return Task.FromResult(_projects.Remove(id));
        }
    }

    private static Project Clone(Project project) => new()
    {
        Id = project.Id,
        Name = project.Name,
        Status = project.Status,
        VehicleId = project.VehicleId,
        BatteryId = project.BatteryId,
        MotorId = project.MotorId,
        Range = project.Range,
        Cost = project.Cost,
        Battery = project.Battery,
        Motor = project.Motor,
        Power = project.Power,
        Torque = project.Torque,
        ReadinessScore = project.ReadinessScore,
        CreatedAt = project.CreatedAt,
        UpdatedAt = project.UpdatedAt
    };
}