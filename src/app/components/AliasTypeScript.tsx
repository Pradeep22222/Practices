///////////////////////////////////// type alias  ////////////////////////////////////////
type UserProps = {
  name: string;
  age: number;
};
// extending type alias
type AdminProps = UserProps & {
  role: string;
};

////////////////////////////// interface alias  //////////////////////////////////////////////////
interface PersonProps {
  name: string;
  age: number;
}
// extending interface alias
interface PersonAdminProps extends UserProps {
  role: string;
}
// Summary
// Interface can only describe object -type where as alias describe object and everything else. (eg. primitive data type such as string, number, boolean)
type Address = string;
const address: Address = "101 clarence";

// type alias can describe union type
type UserAddress = string | string[];
// so
const userAddress: UserAddress = "djfldfjd";
const adminAddress: UserAddress = ["dkfkfj", "dfdf"];
// We can describe another type out of existing type omitting some properties.
type GuestProps = Omit<PersonProps, "age">;
// omitinng with interface
interface GuestPersonProps extends Omit<PersonProps, "name"> {}

// describing tuple, interface vs type
interface Addresss extends Array<number | string> {
  0: number;
  1: string;
}
type Addressss = [number, string];
// interfaces can be merged, so sometimes can be mistakenly merged while defining twice unknowlingly
const board: string[][] = [
  ["dd", "dd"],
  ["dd", "dd"],
];
