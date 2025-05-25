namespace Edm {
	function getLocalDecimalSeperator(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string {
		return (1.1).toLocaleString(locales, options).substring(1, 2);
	}

	export enum DataType {
		Null = 0,
		Binary,
		Boolean,
		Byte,
		DateTime,
		Decimal,
		Double,
		Single,
		Guid,
		Int16,
		Int32,
		Int64,
		SByte,
		String,
		Time,
		DateTimeOffset
	}

	export abstract class Data {
		abstract getDataType(): DataType;
		abstract toODataString(): string;

		static fromODataString(odataString: string): Data | undefined {
			let data = Null.nullFromODataString(odataString);
			if (data === undefined) data = Binary.binaryFromODataString(odataString);
			if (data === undefined) data = Boolean.booleanFromODataString(odataString);
			if (data === undefined) data = Byte.byteFromODataString(odataString);
			if (data === undefined) data = DateTime.datetimeFromODataString(odataString);
			if (data === undefined) data = Decimal.decimalFromODataString(odataString);
			if (data === undefined) data = Double.doubleFromODataString(odataString);
			if (data === undefined) data = Single.singleFromODataString(odataString);
			if (data === undefined) data = Guid.guidFromODataString(odataString);
			if (data === undefined) data = Int16.int16FromODataString(odataString);
			if (data === undefined) data = Int32.int32FromODataString(odataString);
			if (data === undefined) data = Int64.int64FromODataString(odataString);
			if (data === undefined) data = SByte.sbyteFromODataString(odataString);
			if (data === undefined) data = String.stringFromODataString(odataString);
			if (data === undefined) data = Time.timeFromODataString(odataString);
			if (data === undefined) data = DateTimeOffset.datetimeoffsetFromODataString(odataString);
			return data;
		}

		toString(): string {
			let str = this.toODataString();
			return str === "" ? `${undefined}` : str;
		}
	}

	export class Null extends Data {
		constructor() {
			super();
		}

		getDataType(): DataType {
			return DataType.Null;
		}

		static nullFromODataString(odataString: string): Null | undefined {
			if (!/^null$/.test(odataString)) return undefined;
			return new Null();
		}

		toODataString(): string {
			return "null";
		}
	}

	export class Binary extends Data {
		protected data?: Uint8Array;

		constructor(data?: Uint8Array) {
			super();
			this.data = data;
		}

		getDataType(): DataType {
			return DataType.Binary;
		}

		static binaryFromODataString(odataString: string): Binary | undefined {
			if (!/^(binary|X)'([A-Fa-f0-9][A-Fa-f0-9])*?'$/.test(odataString)) return undefined;

			let contentStr = odataString.startsWith("X")
				? odataString.substring(2, odataString.length - 1)
				: odataString.substring(7, odataString.length - 1);
			let byteCount = contentStr.length / 2;
			let data = new Uint8Array(byteCount);

			for (let i = 0; i < byteCount; i++) {
				let hexbyte = contentStr.substring(i * 2, i * 2 + 2);
				data[i] = parseInt(hexbyte, 16);
			}

			return new Binary(data);
		}

		toODataString(): string {
			if (this.data === undefined) return "";

			let bytes: string = "X'";
			for (let i = 0; i < this.data.byteLength; i++) {
				let byte = this.data[i].toString(16).padStart(2, '0');
				bytes = bytes.concat(byte);
			}
			return bytes.concat("'");
		}

		toString(): string {
			if (this.data === undefined) return `${undefined}`;

			let bytes: string = "";
			for (let i = 0; i < this.data.byteLength; i++) {
				let byte = this.data[i].toString(16).padStart(2, '0');
				bytes = bytes.concat(byte);
			}
			return bytes;
		}
	}

	export class Boolean extends Data {
		protected data?: boolean;

		constructor(data?: boolean) {
			super();
			this.data = data;
		}

		getDataType(): DataType {
			return DataType.Boolean;
		}

		static booleanFromODataString(odataString: string): Boolean | undefined {
			if (!/^(true|false)$/.test(odataString)) return undefined;

			switch (odataString) {
				case "true":
					return new Boolean(true);
				case "false":
					return new Boolean(false);
				default:
					return undefined;
			}
		}

		toODataString(): string {
			if (this.data === undefined) return "";

			switch (this.data) {
				case true:
					return "true";
				case false:
					return "false";
			}
		}
	}

	export class Byte extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.Byte;
		}

		static byteFromODataString(odataString: string): Byte | undefined {
			if (!/^([1-9]\d{0,2}|0)$/.test(odataString)) return undefined;
			let num = parseInt(odataString);
			if (num > 255) return undefined;
			return new Byte(num);
		}

		toODataString(): string {
			return this.data.toString(10);
		}
	}

	export class DateTime extends Data {
		protected date?: Date;
		protected secondFractions: number;

		constructor(data?: Date, fractions: number = 0) {
			super();
			this.date = data;
			this.secondFractions = fractions;
			if (data !== undefined && fractions === 0) {
				this.secondFractions = data.getMilliseconds() / 1000.0;
			}
		}

		getDataType(): DataType {
			return DataType.DateTime;
		}

		static datetimeFromODataString(odataString: string): DateTime | undefined {
			if (!/^datetime'\d\d\d\d-\d\d-\d\dT\d\d:\d\d(:\d\d(\.\d{1,7})?)?'$/.test(odataString)) return undefined;
			let year = parseInt(odataString.substring(9, 13), 10);
			if (year < 1753) return undefined;
			let month = parseInt(odataString.substring(14, 16), 10) - 1;
			let day = parseInt(odataString.substring(17, 19), 10);
			let hours = parseInt(odataString.substring(20, 22), 10);
			let minutes = parseInt(odataString.substring(23, 25), 10);
			let seconds = odataString.length > 25 ? parseFloat(odataString.substring(26, odataString.length - 1)) : 0;
			let fractions = seconds - Math.floor(seconds);
			seconds = Math.floor(seconds);
			let millis = Math.round(fractions * 1000);

			let date = new Date(year, month, day, hours, minutes, seconds, millis);

			if (date.getFullYear() !== year
				|| date.getMonth() !== month
				|| date.getDate() !== day
				|| date.getHours() !== hours
				|| date.getMinutes() !== minutes
				|| date.getSeconds() !== seconds
				|| date.getMilliseconds() !== millis
			) return undefined;

			return new DateTime(date, fractions);
		}

		toODataString(): string {
			if (this.date === undefined) return "";

			let str: string = "datetime'".concat(
				this.date.getFullYear().toString().padStart(4, '0'),
				'-',
				(this.date.getMonth() + 1).toString().padStart(2, '0'),
				'-',
				this.date.getDate().toString().padStart(2, '0'),
				'T',
				this.date.getHours().toString().padStart(2, '0'),
				':',
				this.date.getMinutes().toString().padStart(2, '0')
			);

			let useFractions = (this.secondFractions !== 0 || this.date.getMilliseconds() !== 0)
				&& Math.round(this.secondFractions * 1000) === this.date.getMilliseconds();
			if (useFractions || this.date.getSeconds() !== 0) {
				str = str.concat(':', this.date.getSeconds().toString().padStart(2, '0'));
				if (useFractions) {
					str = str.concat('.', this.secondFractions.toString().substring(2, 9).padEnd(7, '0'));
				}
			}

			str = str.concat("'");

			return str;
		}

		toString(): string {
			if (this.date === undefined) return `${undefined}`;
			return this.date.toLocaleString();
		}
	}

	export class Decimal extends Data {
		protected positive: boolean;
		protected intPart: string;
		protected intPartLen: number;
		protected fracPart: string;
		protected fracPartLen: number;

		constructor(integerPart: string, fractionalPart: string = "", positive: boolean = true, integerPartLen: number = -1, fractionalPartLen: number = -1) {
			super();
			this.positive = positive;
			this.intPartLen = integerPartLen === -1 ? integerPart.length : integerPartLen;
			this.intPart = integerPart.substring(0, this.intPartLen).padStart(this.intPartLen, '0');
			this.fracPartLen = fractionalPartLen === -1 ? fractionalPart.length : fractionalPartLen;
			this.fracPart = fractionalPart.substring(0, this.fracPartLen).padEnd(this.fracPartLen, '0');
		}

		getDataType(): DataType {
			return DataType.Decimal;
		}

		static decimalFromODataString(odataString: string): Decimal | undefined {
			if (!/^[+-]?(\d+|\d+\.\d+)[Mm]$/.test(odataString)) return undefined;
			// TODO: range validation
			let startOffset = 0;
			let positive = true;
			if (odataString.startsWith('+')) startOffset++;
			else if (odataString.startsWith('-')) {
				positive = false;
				startOffset++;
			}

			let numstr = odataString.substring(startOffset, odataString.length - 1);
			let parts = numstr.split('.');

			let intPartLen = parts[0].length;
			if (intPartLen < 1) return undefined;
			let fracPartLen = parts.length > 1 ? parts[1].length : 0;

			let intPart = parts[0];
			let fracPart = parts.length > 1 ? parts[1] : "";

			return new Decimal(intPart, fracPart, positive, intPartLen, fracPartLen);
		}

		toODataString(): string {
			let str = "";
			if (!this.positive) str = str.concat('-');
			str = str.concat(this.intPart.padStart(this.intPartLen, '0'));
			if (this.fracPartLen !== 0) {
				str = str.concat('.', this.fracPart.padEnd(this.fracPartLen, '0'));
			}
			str = str.concat('m');
			return str;
		}

		toString(): string {
			return `${this.positive ? '' : '-'}${this.intPart.padStart(this.intPartLen, '0')}.${this.fracPart.padEnd(this.fracPartLen, '0')}`;
		}
	}

	export class Double extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.Double;
		}

		static doubleFromODataString(odataString: string): Double | undefined {
			if (!/^[+-]?(([1-9]\d*|0)(\.\d+)?)(E[+-]\d+)?d$/.test(odataString)) return undefined;
			// TODO: range validation
			let numstr = odataString.substring(0, odataString.length - 1);
			let num = parseFloat(numstr);
			return new Double(num);
		}

		toODataString(): string {
			let str = this.data.toString(10).toUpperCase();
			str = str.concat('d');
			return str;
		}

		toString(): string {
			return this.data.toString();
		}
	}

	export class Single extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.Single;
		}

		static singleFromODataString(odataString: string): Single | undefined {
			if (!/^[+-]?(([1-9]\d*|0)(\.\d+)?)f$/.test(odataString)) return undefined;
			// TODO: range validation
			let numstr = odataString.substring(0, odataString.length - 1);
			let num = parseFloat(numstr);
			return new Single(num);
		}

		toODataString(): string {
			// TODO: prevent scientific notation
			let str = this.data.toString(10);
			str = str.concat('f');
			return str;
		}

		toString(): string {
			return this.data.toString();
		}
	}

	export class Guid extends Data {
		protected guid?: string;

		constructor(data?: string) {
			super();
			this.guid = data;
		}

		getDataType(): DataType {
			return DataType.Guid;
		}

		static guidFromODataString(odataString: string): Guid | undefined {
			if (!/^guid'[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}'$/.test(odataString)) return undefined;
			let guid = odataString.substring(5, odataString.length - 1);
			return new Guid(guid);
		}

		toODataString(): string {
			if (this.guid === undefined) return "";
			return `guid'${this.guid}'`;
		}

		toString(): string {
			if (this.guid === undefined) return `${undefined}`;
			return this.guid;
		}
	}

	export class Int16 extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.Int16;
		}

		static int16FromODataString(odataString: string): Int16 | undefined {
			if (!/^[+-]?([1-9](\d*)?|0)$/.test(odataString)) return undefined;
			// TODO: range validation
			let num = parseInt(odataString);
			return new Int16(num);
		}

		toODataString(): string {
			return this.data.toString(10);
		}
	}

	export class Int32 extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.Int32;
		}

		static int32FromODataString(odataString: string): Int32 | undefined {
			if (!/^[+-]?([1-9](\d*)?|0)$/.test(odataString)) return undefined;
			// TODO: range validation
			let num = parseInt(odataString);
			return new Int32(num);
		}

		toODataString(): string {
			return this.data.toString(10);
		}
	}

	export class Int64 extends Data {
		protected data: bigint;

		constructor(data?: bigint) {
			super();
			this.data = data === undefined ? 0n : data;
		}

		getDataType(): DataType {
			return DataType.Int64;
		}

		static int64FromODataString(odataString: string): Int64 | undefined {
			if (!/^[+-]?([1-9](\d*)?|0)L$/.test(odataString)) return undefined;
			// TODO: range validation
			let numstr = odataString.substring(0, odataString.length - 1);
			let num = BigInt(numstr);
			return new Int64(num);
		}

		toODataString(): string {
			return this.data.toString(10);
		}
	}

	export class SByte extends Data {
		protected data: number;

		constructor(data?: number) {
			super();
			this.data = data === undefined ? 0 : data;
		}

		getDataType(): DataType {
			return DataType.SByte;
		}

		static sbyteFromODataString(odataString: string): SByte | undefined {
			if (!/^[+-]?([1-9]\d{0,2}|0)$/.test(odataString)) return undefined;
			let num = parseInt(odataString);
			if (num < -128 || num > 127) return undefined;
			return new SByte(num);
		}

		toODataString(): string {
			return this.data.toString(10);
		}
	}

	export class String extends Data {
		protected data?: string;

		constructor(data?: string) {
			super();
			this.data = data;
		}

		getDataType(): DataType {
			return DataType.String;
		}

		static stringFromODataString(odataString: string): String | undefined {
			if (!/^'([^']|'')*?'$/.test(odataString)) return undefined;
			let content = odataString.substring(1, odataString.length - 1).replaceAll("''", "'");
			return new String(content);
		}

		toODataString(): string {
			if (this.data === undefined) return "";
			return `'${this.data.replaceAll("'", "''")}'`;
		}

		toString(): string {
			if (this.data === undefined) return `${undefined}`;
			return this.data;
		}
	}

	export class Time extends Data {
		protected hours: number;
		protected minutes: number;
		protected seconds: number;

		constructor(hours?: number, minutes?: number, seconds?: number) {
			super();
			this.hours = hours === undefined ? 0 : hours;
			this.minutes = minutes === undefined ? 0 : minutes;
			this.seconds = seconds === undefined ? 0 : seconds;
		}

		getDataType(): DataType {
			return DataType.Time;
		}

		static timeFromODataString(odataString: string): Time | undefined {
			if (!/^time'P(0Y)?(0M)?(0W)?(0D)?T(\d+H)(\d+M)((0|[1-9]\d*)(\.\d+)?S)?'$/.test(odataString)) return undefined;
			let content = odataString.substring(5, odataString.length - 1).split('T')[1];
			let hoursSplit = content.split('H');
			let minutesSplit = (hoursSplit.length === 1 ? hoursSplit[0] : hoursSplit[1]).split('M');
			let secondsSplit = (minutesSplit.length === 1 ? minutesSplit[0] : minutesSplit[1]).split('S');

			let hours = hoursSplit.length === 1 ? 0 : parseFloat(hoursSplit[0]);
			if (hours > 24) return undefined;
			let minutes = minutesSplit.length === 1 ? 0 : parseFloat(minutesSplit[0]);
			if ((hours === 24 && minutes !== 0) || minutes >= 60) return undefined;
			let seconds = secondsSplit.length === 1 ? 0 : parseFloat(secondsSplit[0]);
			if ((hours === 24 && seconds !== 0) || seconds >= 60) return undefined;

			return new Time(hours, minutes, seconds);
		}

		toODataString(): string {
			if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) return "";
			let str = "time'PT";
			// TODO: prevent scientific notation
			if (this.hours !== 0) str = str.concat(this.hours.toString(10), 'H');
			if (this.minutes !== 0) str = str.concat(this.minutes.toString(10), 'M');
			if (this.seconds !== 0) str = str.concat(this.seconds.toString(10), 'S');
			str = str.concat("'");
			return str;
		}

		toString(): string {
			return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
		}
	}

	export class DateTimeOffset extends Data {
		protected date?: Date;
		protected secondFractions: number;
		protected tzHours: number;
		protected tzMinutes: number;

		constructor(data?: Date, fractions: number = 0, tzHours: number = 0, tzMinutes: number = 0) {
			super();
			this.date = data;
			this.secondFractions = fractions;
			this.tzHours = tzHours;
			this.tzMinutes = tzMinutes;
		}

		getDataType(): DataType {
			return DataType.DateTimeOffset;
		}

		static datetimeoffsetFromODataString(odataString: string): DateTimeOffset | undefined {
			let matches = /^datetimeoffset'(?<year>\d\d\d\d)-(?<month>\d\d)-(?<day>\d\d)T(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d(?:\.\d+)?)(?<tz>(?:(?<tzsign>[+-])(?<tzhours>\d\d):(?<tzminutes>\d\d))|Z)'$/.exec(odataString);
			if (matches === null || matches.groups === undefined) return undefined;

			let year = parseInt(matches.groups["year"]);
			if (year < 1753) return undefined;
			let month = parseInt(matches.groups["month"]) - 1;
			let day = parseInt(matches.groups["day"]);
			let hours = parseInt(matches.groups["hours"]);
			let minutes = parseInt(matches.groups["minutes"]);
			let seconds = parseFloat(matches.groups["seconds"]);
			let fractions = seconds - Math.floor(seconds);
			seconds = Math.floor(seconds);
			let millis = Math.round(fractions * 1000);

			let tzone = matches.groups["tz"];

			let utcDate = Date.UTC(year, month, day, hours, minutes, seconds, millis);
			if (isNaN(utcDate)) return undefined;
			let date = new Date(utcDate);

			if (date.getUTCFullYear() !== year
				|| date.getUTCMonth() !== month
				|| date.getUTCDate() !== day
				|| date.getUTCHours() !== hours
				|| date.getUTCMinutes() !== minutes
				|| date.getUTCSeconds() !== seconds
				|| date.getUTCMilliseconds() !== millis
			) return undefined;

			let tzhours = 0;
			let tzminutes = 0;

			if (tzone !== "Z") {
				let tzadd = matches.groups["tzsign"] === '+';
				tzhours = parseInt(matches.groups["tzhours"]) * (tzadd ? 1 : -1);
				tzminutes = parseInt(matches.groups["tzminutes"]) * (tzadd ? 1 : -1);

				date.setUTCHours(date.getUTCHours() - tzhours);
				date.setUTCMinutes(date.getUTCMinutes() - tzminutes);
			}

			return new DateTimeOffset(date, fractions, tzhours, tzminutes);
		}

		toODataString(): string {
			if (this.date === undefined) return "";
			let str = "datetimeoffset'";

			let date = new Date(this.date.valueOf());
			date.setUTCHours(date.getUTCHours() + this.tzHours);
			date.setUTCMinutes(date.getUTCMinutes() + this.tzMinutes);

			str = str.concat(
				date.getUTCFullYear().toString(10).padStart(4, '0'),
				'-',
				(date.getUTCMonth() + 1).toString(10).padStart(2, '0'),
				'-',
				date.getUTCDate().toString(10).padStart(2, '0'),
				'T',
				date.getUTCHours().toString(10).padStart(2, '0'),
				':',
				date.getUTCMinutes().toString(10).padStart(2, '0'),
				':',
				date.getUTCSeconds().toString(10).padStart(2, '0')
			);

			if ((this.secondFractions !== 0 || this.date.getUTCMilliseconds() !== 0)
				&& Math.round(this.secondFractions * 1000) === this.date.getUTCMilliseconds()) {
				str = str.concat('.', this.secondFractions.toString().substring(2, 9));
			}

			if (this.tzHours !== 0 || this.tzMinutes !== 0) {
				let add = !(this.tzHours < 0 || this.tzMinutes < 0);
				str = str.concat(add ? '+' : '-', Math.abs(this.tzHours).toString(10).padStart(2, '0'), ':', Math.abs(this.tzMinutes).toString(10).padStart(2, '0'));
			} else {
				str = str.concat("Z");
			}

			str = str.concat("'");
			return str;
		}

		toString(): string {
			if (this.date === undefined) return `${undefined}`;
			return this.date.toString();
		}
	}
}

export default Edm;
