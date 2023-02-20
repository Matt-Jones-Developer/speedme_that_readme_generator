def get_user_input():
    user_input = input("Please enter your input: ")
    print("You entered:", user_input)
    
    # ask if user wants to modify input
    modify_input = input("Do you want to modify your input? (y/n): ")
    
    # if user wants to modify, update input and re-print it
    if modify_input.lower() == "y":
        user_input = input("Please enter your modified input: ")
        print("You entered:", user_input)
        
    return user_input
