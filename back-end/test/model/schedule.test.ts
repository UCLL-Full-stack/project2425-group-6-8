import { User, Item, GroceryList, Schedule, Message, Group } from "../../model";


test('given: valid values for a schedule, when: schedule is created, then: schedule is created with those values', () => {
    // given
    const name = "Project Meeting";
    const startDate = new Date("2024-11-01T09:00:00");
    const endDate = new Date("2024-11-01T10:00:00");

    // when
    const schedule = new Schedule({
        name,
        startDate,
        endDate
    });

    // then
    expect(schedule.getName()).toEqual(name);
    expect(schedule.getStartDate()).toEqual(startDate);
    expect(schedule.getEndDate()).toEqual(endDate);
});

